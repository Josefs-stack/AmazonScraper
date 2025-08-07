import ProductList from "./components/ProductList";
import styled from "styled-components";

const Container = styled.main`
  width: 100vw; 
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ContainerInternal = styled.div`
  width: 95vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: #DFE1F5;
`;

function App() {
  return (
    <Container>
      <ContainerInternal>
        <ProductList />
      </ContainerInternal>
    </Container>
  );
}

export default App;
