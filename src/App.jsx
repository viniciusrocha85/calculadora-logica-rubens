import { useState } from "react";
import "./App.css";

// Teclado de botões para a calculadora
const BUTTON_ROWS = [
  ["A", "B", "C", "D", "DEL"],
  ["(", ")"],
  ["→", "∧"],
  ["↔", "∨"],
  ["∼", "⊻"],
  ["AC", "="],
];

function tokenize(input) {
  const tokens = [];
  const text = input.replace(/\s+/g, "");

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // Variáveis: A, B, C, D
    if (/[A-D]/.test(ch)) {
      tokens.push({ type: "VAR", value: ch });
      continue;
    }

    // Parênteses(tratamento exclusivo).
    if (ch === "(" || ch === ")") {
      tokens.push({ type: ch, value: ch });
      continue;
    }

    // Portas Lógicas
    if (ch === "~" || ch === "∼") {
      tokens.push({ type: "NOT", value: "NOT" });
      continue;
    }
    if (ch === "^" || ch === "∧") {
      tokens.push({ type: "AND", value: "AND" });
      continue;
    }
    if (ch === "v" || ch === "∨") {
      tokens.push({ type: "OR", value: "OR" });
      continue;
    }
    if (ch === "⊻") {
      tokens.push({ type: "XOR", value: "XOR" });
      continue;
    }
    if (ch === "→") {
      tokens.push({ type: "IMP", value: "IMP" });
      continue;
    }
    if (ch === "↔") {
      tokens.push({ type: "BICOND", value: "BICOND" });
      continue;
    }

// tratativa de erro para símbolos desconhecidos.
    throw new Error(`Símbolo desconhecido: ${ch}`);
  }

  return tokens;
}

//arvore da expressão
function parse(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
//tratamento de erro para expressões inválidas.
  function consume(expectedType) {
    const token = tokens[pos];
    if (!token || token.type !== expectedType) {
      throw new Error(`Esperava ${expectedType}, mas encontrei ${token ? token.type : "fim"}`);
    }
    pos++;
    return token;
  }

  function parseExpression() {
    return parseBiconditional();
  }
//definicao das portas logicas (Bicondicional)
  function parseBiconditional() {
    let node = parseImplication();
    while (peek() && peek().type === "BICOND") {
      consume("BICOND");
      const right = parseImplication();
      node = { type: "BICOND", left: node, right };
    }
    return node;
  }
//definicao das portas logicas (Implication)
  function parseImplication() {
    let node = parseOr();
    while (peek() && peek().type === "IMP") {
      consume("IMP");
      const right = parseOr();
      node = { type: "IMP", left: node, right };
    }
    return node;
  }
//Definição da Porta Lógica OU (OR)
  function parseOr() {
    let node = parseXor();
    while (peek() && peek().type === "OR") {
      consume("OR");
      const right = parseXor();
      node = { type: "OR", left: node, right };
    }
    return node;
  }

//Definição da Porta Lógica XOR (Exclusiva OU)
  function parseXor() {
    let node = parseAnd();
    while (peek() && peek().type === "XOR") {
      consume("XOR");
      const right = parseAnd();
      node = { type: "XOR", left: node, right };
    }
    return node;
  }
//Definição da Porta Lógica E (AND)
  function parseAnd() {
    let node = parseUnary();
    while (peek() && peek().type === "AND") {
      consume("AND");
      const right = parseUnary();
      node = { type: "AND", left: node, right };
    }
    return node;
  }
//Definição da Porta Lógica NÃO (NOT)
  function parseUnary() {
    while (peek() && peek().type === "NOT") {
      consume("NOT");
      const child = parseUnary();
      return { type: "NOT", child };
    }
    return parsePrimary();
  }
//Tratamento de variáveis e parênteses (erro para expressões incompletas).
  function parsePrimary() {
    const token = peek();
    if (!token) throw new Error("Expressão incompleta");

    if (token.type === "VAR") {
      consume("VAR");
      return { type: "VAR", name: token.value };
    }
//tratamento de exclusividade dos parênteses
    if (token.type === "(") {
      consume("(");
      const node = parseExpression();
      if (!peek() || peek().type !== ")") {
        throw new Error("Faltou fechar parêntese");
      }
      consume(")");
      return node;
    }
    throw new Error(`Token inesperado: ${token.type}`);
  }


  const expr = parseExpression();

  if (pos !== tokens.length) {
    throw new Error("Sobrou coisa depois da expressão");
  }

  return expr;
}

//Avaliação da Arvore de Expressão

function evalAst(node, env) {
  switch (node.type) {
    case "VAR":
      return !!env[node.name];

    case "NOT":
      return !evalAst(node.child, env);

    case "AND":
      return evalAst(node.left, env) && evalAst(node.right, env);

    case "OR":
      return evalAst(node.left, env) || evalAst(node.right, env);

    case "XOR": {
      const a = evalAst(node.left, env);
      const b = evalAst(node.right, env);
      return (a || b) && !(a && b);
    }

    case "IMP": {
      const a = evalAst(node.left, env);
      const b = evalAst(node.right, env);
      return !a || b;
    }

    case "BICOND": {
      const a = evalAst(node.left, env);
      const b = evalAst(node.right, env);
      return a === b;
    }

    default:
      throw new Error("Tipo de nó desconhecido: " + node.type);
  }
}

// Geração da Tabela Verdade

function getUsedVariables(tokens) {
  const set = new Set();
  tokens.forEach((t) => {
    if (t.type === "VAR") set.add(t.value);
  });
  return Array.from(set).sort();
}

function generateTruthTable(expression) {
  if (!expression.trim()) {
    throw new Error("Digite uma expressão primeiro.");
  }

  const tokens = tokenize(expression);
  const vars = getUsedVariables(tokens);

  if (vars.length === 0) {
    throw new Error("Use pelo menos uma letra (A, B, C, D) na expressão.");
  }

  // Limite opcional para evitar tabelas muito grandes
  if (vars.length > 6) {
    throw new Error("Use no máximo 6 variáveis diferentes para a tabela.");
  }

  const ast = parse(tokens);
//geração das linhas da tabela verdade (2^n)
  const rows = [];
  const total = Math.pow(2, vars.length);
  
// Geração das combinações de valores para as variáveis
  for (let i = 0; i < total; i++) {
    const env = {};
    vars.forEach((v, index) => {
      const bit = (i >> (vars.length - 1 - index)) & 1;
      env[v] = bit === 1;
    });

    const result = evalAst(ast, env);
    rows.push({
      assignment: env,
      result: result ? "V" : "F",
    });
  }

  return { vars, rows };
}

//Componente da Calculadora
export default function App() {
  const [expression, setExpression] = useState("");
  const [table, setTable] = useState(null);
  const [error, setError] = useState("");

  function handleButtonClick(text) {
    if (text === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
      setError("");
      return;
    }
    if (text === "AC") {
      setExpression("");
      setTable(null);
      setError("");
      return;
    }
    if (text === "=") {
      handleCalculate();
      return;
    }

    setExpression((prev) => prev + text);
    setError("");
  }

  function handleChange(e) {
    setExpression(e.target.value.toUpperCase());
    setError("");
  }

  function handleCalculate() {
    try {
      const result = generateTruthTable(expression);
      setTable(result);
      setError("");
    } catch (e) {
      setTable(null);
      setError(e.message);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Calculadora Lógica</h1>
        <p>Use letras (A, B, C...) e os símbolos para montar a expressão.</p>
      </header>

      <main className="app-main">
        <section className="keyboard">
          {BUTTON_ROWS.map((row, idx) => (
            <div key={idx} className="keyboard-row">
              {row.map((btn) => (
                <button
                  key={btn}
                  className="key-btn"
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="expression-box">
            <label>Expressão:</label>
            <input
              type="text"
              value={expression}
              onChange={handleChange}
              placeholder="Ex: (A ∧ B) → ∼C"
            />
            <button className="calc-btn" onClick={handleCalculate}>
              Gerar tabela
            </button>
            {error && <div className="error">{error}</div>}
          </div>

          <div className="table-box">
            {table ? (
              <table>
                <thead>
                  <tr>
                    {table.vars.map((v) => (
                      <th key={v}>{v}</th>
                    ))}
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, idx) => (
                    <tr key={idx}>
                      {table.vars.map((v) => (
                        <td key={v}>{row.assignment[v] ? "V" : "F"}</td>
                      ))}
                      <td className={row.result === "V" ? "true-cell" : "false-cell"}>
                        {row.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="hint">A tabela aparece aqui depois que você gerar.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
