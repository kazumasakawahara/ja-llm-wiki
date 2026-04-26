//! Japanese tokenization Tauri command, backed by Lindera (MeCab-compatible).
//!
//! Called from `src/lib/tokenize-ja.ts` only when the user has opted into
//! the high-accuracy mode in Settings. Default mode uses the browser's
//! Intl.Segmenter, no Rust round-trip needed.
//!
//! IPADIC is embedded into the binary via the `embed-ipadic` feature so
//! no on-disk dictionary files need to be shipped. Token detail layout
//! for IPADIC (after the 4 always-present fields surface / left_context_id
//! / right_context_id / cost which Lindera does NOT include in
//! `details()`):
//!
//!   details[0] = part_of_speech (major class, e.g. "名詞", "動詞", "助詞")
//!   details[1] = part_of_speech_subcategory_1
//!   details[2] = part_of_speech_subcategory_2
//!   details[3] = part_of_speech_subcategory_3
//!   details[4] = conjugation_form
//!   details[5] = conjugation_type
//!   details[6] = base_form (lemma — what we want for query matching)
//!   details[7] = reading
//!   details[8] = pronunciation

use lindera::dictionary::{load_embedded_dictionary, DictionaryKind};
use lindera::mode::Mode;
use lindera::segmenter::Segmenter;
use lindera::tokenizer::Tokenizer;
use std::collections::HashSet;
use std::sync::OnceLock;

use crate::panic_guard::run_guarded;

static TOKENIZER: OnceLock<Tokenizer> = OnceLock::new();

fn get_tokenizer() -> Result<&'static Tokenizer, String> {
    if let Some(t) = TOKENIZER.get() {
        return Ok(t);
    }
    let dictionary = load_embedded_dictionary(DictionaryKind::IPADIC)
        .map_err(|e| format!("lindera: failed to load IPADIC: {e}"))?;
    let segmenter = Segmenter::new(Mode::Normal, dictionary, None);
    let tokenizer = Tokenizer::new(segmenter);
    // OnceLock::set returns Err if another thread already set it; that's
    // fine — we just take whatever's there.
    let _ = TOKENIZER.set(tokenizer);
    TOKENIZER
        .get()
        .ok_or_else(|| "lindera: tokenizer not set".to_string())
}

/// Stop POS classes — must match the JS-side `tokenizeQuery` filter so
/// the embedding query and the Wiki page tokens line up.
const FILTERED_POS: &[&str] = &[
    "助詞",     // particle (が, を, は, に, で, …)
    "助動詞",   // auxiliary verb (です, ます, た, …)
    "記号",     // symbol / punctuation
    "接頭詞",   // prefix
    "感動詞",   // interjection
    "フィラー", // filler ("えーと", "あの", …)
];

#[tauri::command]
pub fn tokenize_ja(text: String) -> Result<Vec<String>, String> {
    run_guarded("tokenize_ja", || {
        // Empty input -> empty output, skip dictionary load.
        if text.is_empty() {
            return Ok(Vec::new());
        }
        let tokenizer = get_tokenizer()?;
        let mut tokens = tokenizer
            .tokenize(&text)
            .map_err(|e| format!("lindera: tokenize failed: {e}"))?;

        let mut out: Vec<String> = Vec::with_capacity(tokens.len());
        let mut seen: HashSet<String> = HashSet::new();

        for tok in tokens.iter_mut() {
            let surface = tok.surface.to_string();
            let details = tok.details();
            let pos = details.first().copied().unwrap_or("");
            if FILTERED_POS.contains(&pos) {
                continue;
            }
            // Prefer base_form (details[6]) over surface so inflected
            // forms collapse onto their lemma: "走った" -> "走る",
            // "用いた" -> "用いる".
            let base = details
                .get(6)
                .filter(|s| !s.is_empty() && **s != "*")
                .map(|s| s.to_string())
                .unwrap_or(surface);

            if base.is_empty() {
                continue;
            }
            // Lowercase to match the JS-side tokenizer contract (latin
            // case folded; CJK toLowerCase is a no-op so safe).
            let base = base.to_lowercase();
            if seen.insert(base.clone()) {
                out.push(base);
            }
        }
        Ok(out)
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tokenizes_simple_sentence() {
        let result = tokenize_ja("本研究では機械学習を用いた".to_string()).unwrap();
        // "機械" and "学習" should be present (IPADIC splits compounds);
        // particles and auxiliaries should be filtered out.
        assert!(
            result.iter().any(|t| t == "機械"),
            "expected '機械' in {:?}",
            result
        );
        assert!(
            result.iter().any(|t| t == "学習"),
            "expected '学習' in {:?}",
            result
        );
        // Particles (を, は, で) and auxiliaries (た) must be dropped.
        for stop in &["を", "は", "で", "た"] {
            assert!(
                !result.iter().any(|t| t == *stop),
                "stop word '{}' leaked into {:?}",
                stop,
                result
            );
        }
    }

    #[test]
    fn handles_empty_input() {
        let result = tokenize_ja(String::new()).unwrap();
        assert_eq!(result.len(), 0);
    }

    #[test]
    fn lemmatizes_inflected_verb() {
        let result = tokenize_ja("速く走った".to_string()).unwrap();
        // "走った" should lemmatize to "走る" via details[6].
        assert!(
            result.iter().any(|t| t == "走る"),
            "expected '走る' (lemma of 走った) in {:?}",
            result
        );
        // "速く" is an adjective ("形容詞"), not a stop POS, so its
        // base form "速い" should appear.
        assert!(
            result.iter().any(|t| t == "速い"),
            "expected '速い' (lemma of 速く) in {:?}",
            result
        );
    }

    #[test]
    fn deduplicates_repeated_tokens() {
        let result = tokenize_ja("機械学習機械学習".to_string()).unwrap();
        // "機械" and "学習" each appear twice in the input; output
        // must contain one occurrence of each.
        let machine_count = result.iter().filter(|t| *t == "機械").count();
        let learn_count = result.iter().filter(|t| *t == "学習").count();
        assert_eq!(machine_count, 1, "got {:?}", result);
        assert_eq!(learn_count, 1, "got {:?}", result);
    }

    #[test]
    fn lowercases_latin_tokens() {
        let result = tokenize_ja("PythonとRust".to_string()).unwrap();
        // Latin tokens should be lowercased to match the JS-side
        // tokenizer contract.
        assert!(
            result.iter().any(|t| t == "python"),
            "expected 'python' in {:?}",
            result
        );
        assert!(
            result.iter().any(|t| t == "rust"),
            "expected 'rust' in {:?}",
            result
        );
    }
}
