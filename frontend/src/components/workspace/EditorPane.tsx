import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown, Code2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '@/api/types';
import { cn } from '@/lib/utils';

const LANGUAGES: { value: Language; label: string; monaco: string; icon: string }[] = [
  { value: 'CPP', label: 'C++', monaco: 'cpp', icon: 'C++' },
  { value: 'JAVA', label: 'Java', monaco: 'java', icon: 'Jv' },
  { value: 'PYTHON', label: 'Python', monaco: 'python', icon: 'Py' },
];

const BOILERPLATE: Record<Language, string> = {
  CPP: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    Solution sol;
    auto result = sol.twoSum(nums, target);
    if (result.size() == 2) cout << result[0] << " " << result[1] << endl;
    return 0;
}`,
  JAVA: `import java.util.*;

class Main {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        Main sol = new Main();
        int[] result = sol.twoSum(nums, target);
        if (result != null && result.length == 2) {
            System.out.println(result[0] + " " + result[1]);
        }
    }
}`,
  PYTHON: `import sys
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        return []

if __name__ == "__main__":
    input_data = sys.stdin.read().split()
    if not input_data:
        sys.exit()
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    sol = Solution()
    result = sol.twoSum(nums, target)
    if len(result) == 2:
        print(f"{result[0]} {result[1]}")
`,
  JAVASCRIPT: `// JavaScript not available for this problem`,
  GO: `// Go not available for this problem`,
  RUST: `// Rust not available for this problem`,
};

interface EditorPaneProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCodeChange: (code: string) => void;
  code: string;
}

export function EditorPane({ language, onLanguageChange, onCodeChange, code }: EditorPaneProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const editorRef = useRef<Parameters<NonNullable<Parameters<typeof Editor>[0]['onMount']>>[0] | null>(null);
  const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  useEffect(() => {
    if (!code) {
      onCodeChange(BOILERPLATE[language]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleEditorMount = (editor: Parameters<NonNullable<Parameters<typeof Editor>[0]['onMount']>>[0]) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <Code2 className="h-4 w-4 text-neon-emerald" />
            <span className="font-medium">{currentLang.label}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 text-white/30 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="glass-strong absolute left-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl p-1.5"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => {
                        onLanguageChange(lang.value);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                        language === lang.value ? 'text-neon-emerald' : 'text-white/70',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-white/5 text-[10px] font-bold">
                          {lang.icon}
                        </span>
                        {lang.label}
                      </span>
                      {language === lang.value && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Editor info */}
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span>UTF-8</span>
          <span>·</span>
          <span>Spaces: 4</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={currentLang.monaco}
          value={code}
          onChange={(val) => onCodeChange(val || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            roundedSelection: true,
            automaticLayout: true,
            tabSize: 4,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-neon-emerald" />
            </div>
          }
        />
      </div>
    </div>
  );
}
