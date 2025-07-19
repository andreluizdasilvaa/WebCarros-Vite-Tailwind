# WebCarros

![Project operation](./src/assets/webcarros.gif)

WebCarros é uma aplicação web desenvolvida para facilitar a compra e venda de carros novos e usados. O projeto permite que usuários anunciem veículos, pesquisem por carros disponíveis e entrem em contato com os vendedores diretamente pela plataforma. 
criado com o objetivo de praticar typescript.

## Funcionalidades

### Usuários
- **Cadastro e Login**:
  - Cadastro de novos usuários com validação de dados.
  - Login seguro utilizando Firebase Authentication.
- **Autenticação**:
  - Rotas públicas e privadas protegidas.
  - Persistência de sessão do usuário.

### Anúncios
- **Cadastro de Carros**:
  - Cadastro de veículos com informações detalhadas, como nome, modelo, ano, quilometragem, preço, cidade, telefone e descrição.
  - Upload de até 3 imagens por anúncio, com validação de formato e tamanho.
- **Gerenciamento de Anúncios**:
  - Listagem de carros cadastrados pelo usuário no painel de controle.
  - Exclusão de anúncios diretamente pelo painel.
- **Busca de Carros**:
  - Pesquisa por nome de veículos com filtros dinâmicos.

### Visualização
- **Detalhes do Veículo**:
  - Exibição de informações completas do carro, incluindo imagens em um carrossel interativo.
  - Botão para contato direto com o vendedor via WhatsApp.

## Tecnologias Utilizadas

### Frontend
- **React**:
  - Biblioteca principal para construção da interface.
- **TypeScript**:
  - Tipagem estática para maior segurança e escalabilidade do código.
- **Vite**:
  - Ferramenta de build rápida e eficiente.
- **TailwindCSS**:
  - Framework CSS para estilização responsiva e moderna.
- **React Hook Form**:
  - Gerenciamento de formulários com validação integrada.
- **Zod**:
  - Validação de dados e integração com formulários.
- **React Toastify**:
  - Exibição de notificações toast.
- **Swiper**:
  - Carrossel interativo para exibição de imagens.

### Backend e Serviços
- **Firebase**:
  - **Authentication**: Gerenciamento de autenticação de usuários.
  - **Firestore**: Banco de dados NoSQL para armazenamento de informações dos carros.
- **Cloudinary**:
  - Serviço de upload e gerenciamento de imagens
