🌟 Calculadora Lógica – Tabelas Verdade Interativas

Uma aventura lógica criada com React!

Bem-vindo à Calculadora Lógica, um projeto desenvolvido para transformar expressões proposicionais em tabelas verdade completas, de maneira intuitiva, rápida e divertida.
Se você sempre quis entender lógica como um mestre Jedi — ou apenas quer uma ferramenta poderosa para estudar — então você chegou ao lugar certo! 💡⚔️

🚀 Sobre o projeto

A Calculadora Lógica é uma aplicação feita em React, com um teclado próprio para montar expressões lógicas e um motor interno capaz de:

interpretar variáveis (A, B, C...)

analisar operadores como
∧, ∨, ⊻, →, ↔, ∼

validar parênteses e estrutura

gerar tabelas verdade completas

exibir o resultado de forma clara, elegante e rápida

Tudo isso funcionando diretamente no navegador, sem backend e sem mágica — só lógica! 🔮

🧠 O que ela faz?

✔ Aceita expressões como:
(A ∧ B) → ∼C
(A ∨ B) ↔ (C ⊻ D)
∼(A → B) ∧ C

✔ Monta automaticamente todas as combinações possíveis de valores verdade

✔ Avalia a expressão usando uma árvore sintática (AST)

✔ Indica o resultado final para cada linha: V ou F

✔ Interface com teclado lógico personalizado

✔ Visual moderno inspirado em calculadoras lógicas profissionais

🎮 Como usar

Escreva a expressão usando:

letras A–D

parênteses ( )

operadores:

Operador	Significado
∼	NOT (negação)
∧	AND (e)
∨	OR (ou)
⊻	XOR (ou exclusivo)
→	Implicação
↔	Bicondicional

Pressione Gerar tabela ou o botão =.

Veja a tabela verdade aparecer como mágica! ✨

🛠️ Tecnologias usadas

⚛️ React

🎨 CSS moderno e responsivo

🧩 Parser manual (tokenização + AST)

⚡ Renderização eficiente com useState

🏗️ Como rodar o projeto localmente
git clone https://github.com/viniciusrocha85/calculadora-logica-rubens
cd calculadora-logica-rubens
npm install
npm start


Isso vai abrir no navegador em:

http://localhost:3000


📚 Lógica por trás dos operadores

A calculadora entende todo o conjunto da lógica proposicional:

NOT (∼A): inverte o valor

AND (A ∧ B): verdadeiro se ambos forem verdadeiros

OR (A ∨ B): verdadeiro se pelo menos um for

XOR (A ⊻ B): verdadeiro se forem diferentes

IMP (A → B): falso só quando A é V e B é F

BICOND (A ↔ B): verdadeiro quando ambos forem iguais

Tudo isso é resolvido usando uma árvore sintática recursiva, igual linguagens de programação de verdade.

🎨 Design e usabilidade

Tema escuro elegante

Botões que lembram uma calculadora científica

Tabela verdade com destaque visual em Verdadeiro e Falso

Layout responsivo (funciona no celular também!) 📱

Erros amigáveis: parênteses faltando, operadores inválidos, etc

🧑‍🎓 Ideal para:

estudantes de lógica

alunos do ensino médio

programadores iniciantes

curiosos da matemática

professores de filosofia 🧠

quem gosta de apertar botões 😁

❤️ Contribuições

Sugestões são super bem-vindas!
Se quiser adicionar novos operadores, novos temas ou até um modo “passo a passo”, abra uma issue ou faça um PR!

✨ Licença

Este projeto é open-source — modifique, estude e divirta-se com ele!