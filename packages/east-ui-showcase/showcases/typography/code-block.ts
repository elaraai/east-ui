import { East, some } from "@elaraai/east";
import { CodeBlock, UIComponentType, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * CodeBlock showcase - demonstrates multi-line code blocks with syntax highlighting.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic code block
        const basic = $.let(
            ShowcaseCard(
                "Basic Code Block",
                "Simple multi-line code",
                CodeBlock.Root("const x = 1;\nconst y = 2;\nconsole.log(x + y);"),
                some(`CodeBlock.Root(\`const x = 1;\\nconst y = 2;\\nconsole.log(x + y);\`)`)
            )
        );

        // With language
        const withLanguage = $.let(
            ShowcaseCard(
                "With Language",
                "TypeScript code block",
                CodeBlock.Root("function greet(name: string): string {\n\treturn `Hello, ${name}!`;\n}", { language: "typescript" }),
                some("CodeBlock.Root(\"function greet(name: string): string {\\n\\treturn `Hello, ${name}!`;\\n}\", { language: \"typescript\" })")
            )
        );

        // Line numbers
        const lineNumbers = $.let(
            ShowcaseCard(
                "Line Numbers",
                "Code with line numbers displayed",
                CodeBlock.Root("import { East } from \"@elaraai/east\";\nconst value = East.value(42);\nconsole.log(value);", {
                    language: "typescript",
                    showLineNumbers: true,
                }),
                some(`
                    CodeBlock.Root(\`import { East } from "@elaraai/east";...\`, {
                        language: "typescript",
                        showLineNumbers: true,
                    })
                `)
            )
        );

        // Highlighted lines
        const highlighted = $.let(
            ShowcaseCard(
                "Highlighted Lines",
                "Specific lines emphasized",
                CodeBlock.Root("function calculate() {\n\tconst a = 10;\n\tconst b = 20;\n\treturn a + b;  // Important line\n}", {
                    language: "typescript",
                    showLineNumbers: true,
                    highlightLines: [4n],
                }),
                some(`
                    CodeBlock.Root(\`function calculate() {...}\`, {
                        language: "typescript",
                        showLineNumbers: true,
                        highlightLines: [4n],
                    })
                `)
            )
        );

        // Max height
        const maxHeight = $.let(
            ShowcaseCard(
                "Max Height",
                "Scrollable code block",
                CodeBlock.Root("// Long code example\nfunction processData(data) {\n  const results = [];\n\n  for (const item of data) {\n    const processed = transform(item);\n    results.push(processed);\n  }\n\n  return results;\n}\n\nfunction transform(item) {\n  return {\n    ...item,\n    processed: true,\n  };\n}", {
                    language: "typescript",
                    showLineNumbers: true,
                    maxHeight: "150px",
                }),
                some(`
                    CodeBlock.Root("// Long code example\nfunction processData(data) {\n  const results = [];\n\n  for (const item of data) {\n    const processed = transform(item);\n    results.push(processed);\n  }\n\n  return results;\n}\n\nfunction transform(item) {\n  return {\n    ...item,\n    processed: true,\n  };\n}", {
                        language: "typescript",
                        showLineNumbers: true,
                        maxHeight: "150px",
                    }),
                `)
            )
        );

        // Python example
        const python = $.let(
            ShowcaseCard(
                "Python",
                "Python code example",
                CodeBlock.Root("def fibonacci(n):\nif n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))", {
                    language: "python",
                    showLineNumbers: true,
                }),
                some(`
                    CodeBlock.Root("def fibonacci(n):\nif n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))", {
                        language: "python",
                        showLineNumbers: true,
                    }),
                `)
            )
        );

        // JSON example
        const json = $.let(
            ShowcaseCard(
                "JSON",
                "JSON data example",
                CodeBlock.Root("{\n\t\"name\": \"east-ui\",\n\t\"version\": \"1.0.0\",\n\t\"dependencies\": {\n\t\t\"@elaraai/east\": \"^1.0.0\"\n\t}\n}", {
                    language: "json",
                }),
                some(`
                    CodeBlock.Root("{\n\t\"name\": \"east-ui\",\n\t\"version\": \"1.0.0\",\n\t\"dependencies\": {\n\t\t\"@elaraai/east\": \"^1.0.0\"\n\t}\n}", {
                        language: "json",
                    }),       
                `)
            )
        );

        // Bash example
        const bash = $.let(
            ShowcaseCard(
                "Bash",
                "Terminal commands",
                CodeBlock.Root("$ npm install @elaraai/east-ui\n$ npm run build\n$ npm test", {
                    language: "bash",
                }),
                some(`
                    CodeBlock.Root("$ npm install @elaraai/east-ui\n$ npm run build\n$ npm test", {
                        language: "bash",
                    }),
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(withLanguage),
                Grid.Item(lineNumbers),
                Grid.Item(highlighted),
                Grid.Item(maxHeight),
                Grid.Item(python),
                Grid.Item(json),
                Grid.Item(bash),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
