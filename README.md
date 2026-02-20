# IRL Admin - Painel Administrativo

<div align="center">

[![pt-BR](https://img.shields.io/badge/lang-pt--BR-green.svg)](README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)

</div>

Sistema de gestão educacional desenvolvido para o **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância**, criado no contexto do Projeto de Extensão II (PEX II) da **Faculdade Descomplica** e atualmente aprimorado no **Projeto de Extensão III (PEX III)**, a partir da utilização prática do sistema e das demandas identificadas pela ONG.

## 📋 Sobre o Projeto

O **IRL Admin** é um painel administrativo web desenvolvido especificamente para auxiliar a gestão pedagógica da ONG Instituto Dr. Rocha Lima. O sistema permite controle eficiente da presença dos alunos, acompanhamento de tarefas e geração de relatórios detalhados a partir dos dados coletados, facilitando o trabalho dos educadores e melhorando o acompanhamento pedagógico.

## 🎯 Problemática

Durante a visita à ONG, os educadores relataram a dificuldade em manter um controle organizado e centralizado sobre a frequência dos alunos, o cumprimento das tarefas escolares e a verificação de materiais escolares. Esses processos eram feitos de forma manual, o que demandava tempo, dificultava o acompanhamento pedagógico e limitava a geração de relatórios consolidados para análise.
O IRL Admin surge como resposta a essa necessidade, oferecendo uma solução digital prática e acessível que otimiza o trabalho dos educadores e melhora a gestão pedagógica da instituição.

### 🚀 Objetivo

Facilitar o trabalho dos educadores da ONG através de uma ferramenta digital que permite:

- Controle eficiente da presença dos alunos
- Acompanhamento do cumprimento de tarefas de casa
- Verificação de materiais escolares (mochila)
- Geração de estatísticas e relatórios para acompanhamento pedagógico

## ✨ Funcionalidades Principais

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

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Formulários**: React Hook Form + React Hot Toast
- **Roteamento**: React Router DOM

### Backend & Infraestrutura

- **Database**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Hospedagem**: Firebase Hosting

## 📱 Responsividade

O sistema foi desenvolvido com **mobile-first design**, garantindo uma experiência otimizada em:

- Smartphones (interface principal de uso)
- Tablets e desktops
- Monitores de diferentes resoluções

## 🎨 Interface do Usuário

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

## 📊 Funcionalidades de Análise

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

## 🔒 Segurança e Dados

- **Autenticação Firebase**: Login seguro para educadores
- **Proteção de rotas**: Acesso restrito a usuários autenticados
- **Backup automático**: Dados armazenados na nuvem Firebase
- **Privacidade**: Conformidade com diretrizes de proteção de dados de menores

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte do **Projeto de Extensão II (PEX II)**, demonstrando:

- **Aplicação prática** de conhecimentos técnicos em benefício social
- **Metodologia ágil** de desenvolvimento
- **Colaboração** entre academia e terceiro setor
- **Impacto social** através da tecnologia

## 🏛️ Sobre a ONG

O **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância** é uma organização sem fins lucrativos dedicada ao desenvolvimento educacional e social de crianças e adolescentes, promovendo educação de qualidade e formação cidadã.

## 🎥 Visualização da Interface

O acesso ao sistema é restrito a funcionários cadastrados.
Para demonstrar seu funcionamento, foi preparado um vídeo de prévia que mostra as principais telas e recursos do painel em uso, evidenciando a experiência real de navegação e gestão dentro da plataforma.

https://github.com/user-attachments/assets/37b8e4cd-d075-4ea9-a380-afc5bb89234c

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta Firebase com projeto configurado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/irl-admin.git

# Entre na pasta do projeto
cd irl-admin

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Edite src/firebase/config.js com suas credenciais Firebase

# Execute o projeto em modo de desenvolvimento
npm run dev
```

### Build para Produção

```bash
# Crie a build otimizada
npm run build

# Visualize a build localmente
npm run preview
```

## 📄 Licença

Este projeto foi desenvolvido para uso exclusivo do **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância**.

---

<div align="center">

**Desenvolvido com ❤️ para o Instituto Dr. Rocha Lima de Proteção e Assistência à Infância**

</div>
