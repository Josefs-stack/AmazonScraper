import { useState } from "react";
import styled from "styled-components";

type Product = {
  title: string;
  rating: string;
  reviews: string;
  image: string;
};

const Contain = styled.div`
  width: 90vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;


const ContainerBusca = styled.div`
  width: 100%;
  background-color: #DFE1F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #ccc;
`;


const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #000000;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const InputArea = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  input {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 1rem;
  }

  button {
    padding: 0.5rem 1.2rem;
    background-color: #0077ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      background-color: #999;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

 const ContainerResultado = styled.div`
  flex: 1;
  width: 100%;
  padding: 1rem 2rem;
  overflow-y: auto;
`;

const ProductGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  list-style: none;
  width: 100%;
  box-sizing: border-box;
`;

const ProductCard = styled.li`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
`;

export default function ProductList() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("Erro na requisição");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Falha ao buscar produtos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Contain>
      <ContainerBusca>
        <Header>Busca Amazon</Header>

        <InputArea>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Digite a palavra-chave"
          />
          <button onClick={fetchProducts} disabled={loading}>
            {loading ? "Carregando..." : "Buscar"}
          </button>
        </InputArea>
      </ContainerBusca>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ContainerResultado>
        {loading && <p>Carregando...</p>}
        {!loading && products.length === 0 && <p>Nenhum produto encontrado.</p>}
        <ProductGrid>
          {products.map((product, i) => (
            <ProductCard key={i}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Nota: {product.rating}</p>
              <p>Avaliações: {product.reviews}</p>
            </ProductCard>
          ))}
        </ProductGrid>
      </ContainerResultado>
    </Contain>
  );
}
