# IRL Admin - Painel Administrativo

Sistema de gestão educacional desenvolvido para o **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância** como parte do **Projeto de Extensão II (PEX II)** da faculdade.

## Sobre o Projeto

O **IRL Admin** é um painel administrativo web desenvolvido especificamente para auxiliar a gestão pedagógica da ONG Instituto Dr. Rocha Lima. O sistema permite o controle diário de frequência, acompanhamento de tarefas de casa e organização de materiais escolares dos alunos.

### Objetivo

Facilitar o trabalho dos educadores da ONG através de uma ferramenta digital que permite:

- Controle eficiente da presença dos alunos
- Acompanhamento do cumprimento de tarefas de casa
- Verificação de materiais escolares (mochila)
- Geração de estatísticas e relatórios para acompanhamento pedagógico

## Funcionalidades Principais

### Gestão de Turmas

- **Criação e edição de turmas** com informações completas (nome, responsável, ano letivo, status)
- **Organização alfabética** automática das turmas
- **Controle de status** (ativa/inativa) para gestão de períodos letivos

### Controle Diário de Alunos

- **Registro de presença/ausência** com interface intuitiva
- **Controle de tarefa de casa** (trouxe/não trouxe)
- **Verificação de mochila** (organizada/desorganizada)
- **Interface responsiva** otimizada para dispositivos móveis
- **Componentes visuais** com ícones e cores diferenciadas para cada status

### Estatísticas e Relatórios

- **Dashboard principal** com visão geral de todas as turmas
- **Estatísticas por data específica** com cálculos precisos de frequência
- **Gráficos interativos** para visualização de dados:
  - Tendência dos últimos 30 dias
  - Comparação entre turmas
  - Distribuição percentual por categoria
  - Estatísticas mensais
- **Cálculos automatizados** considerando todos os alunos ativos

### Gestão de Alunos

- **Cadastro de novos alunos** diretamente nas turmas
- **Controle de status** (ativo/inativo) para gestão de matrículas
- **Interface minimalista** para facilitar o uso diário

## Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Formulários**: React Hook Form
- **Backend**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Hospedagem**: Firebase Hosting
- **Roteamento**: React Router DOM

## Responsividade

O sistema foi desenvolvido com **mobile-first design**, garantindo uma experiência otimizada em:

- Smartphones (interface principal de uso)
- Tablets e desktops
- Monitores de diferentes resoluções

## Interface do Usuário

### Design System

- **Cores temáticas** baseadas na identidade visual da ONG
- **Componentes reutilizáveis** para consistência visual
- **Feedback visual** claro para todas as ações do usuário
- **Navegação intuitiva** com ícones autoexplicativos

### Acessibilidade

- **Tooltips informativos** em todos os botões
- **Estados visuais** claros (hover, active, disabled)
- **Contraste adequado** para facilitar a leitura
- **Textos descritivos** para orientação do usuário

## Funcionalidades de Análise

### Cálculos Estatísticos

- **Frequência real**: Considera todos os alunos ativos, não apenas os com registros
- **Correção de fuso horário**: Evita problemas de data entre UTC e horário local
- **Dados por período**: Análises diárias, mensais e anuais
- **Comparações entre turmas**: Para identificar padrões e necessidades específicas

### Visualização de Dados

- **Gráficos de tendência**: Acompanhamento da evolução ao longo do tempo
- **Gráficos de pizza**: Distribuição percentual das categorias
- **Gráficos de barras**: Comparação entre diferentes turmas
- **Tabelas estatísticas**: Dados numéricos detalhados

## Segurança e Dados

- **Autenticação Firebase**: Login seguro para educadores
- **Proteção de rotas**: Acesso restrito a usuários autenticados
- **Backup automático**: Dados armazenados na nuvem Firebase
- **Privacidade**: Conformidade com diretrizes de proteção de dados de menores

## Contexto Acadêmico

Este projeto foi desenvolvido como parte do **Projeto de Extensão II (PEX II)**, demonstrando:

- **Aplicação prática** de conhecimentos técnicos em benefício social
- **Metodologia ágil** de desenvolvimento
- **Colaboração** entre academia e terceiro setor
- **Impacto social** através da tecnologia

## Sobre a ONG

O **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância** é uma organização sem fins lucrativos dedicada ao desenvolvimento educacional e social de crianças e adolescentes, promovendo educação de qualidade e formação cidadã.


**Desenvolvido com ❤️ para o Instituto Dr. Rocha Lima**  
