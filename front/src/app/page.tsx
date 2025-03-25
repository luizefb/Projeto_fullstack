'use client';
import { useEffect, useState } from 'react';

interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
}

export default function Home() {
  const [produto, setProduto] = useState<Produto>({ nome: '', descricao: '', preco: 0 });
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    obterProdutos();
  }, []);

  async function obterProdutos() {
    const resp = await fetch('http://localhost:3001/produtos');
    const data: Produto[] = await resp.json();
    setProdutos(data);
  }

  async function criarProduto() {
    const resp = await fetch('http://localhost:3001/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });
    if (resp.ok) {
      setProduto({ nome: '', descricao: '', preco: 0 });
      await obterProdutos();
    }
  }

  async function alterarProduto() {
    if (produto.id) {
      const resp = await fetch(`http://localhost:3001/produtos/${produto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });
      if (resp.ok) {
        setProduto({ nome: '', descricao: '', preco: 0 });
        await obterProdutos();
      }
    }
  }

  async function excluirProduto(id: number) {
    const resp = await fetch(`http://localhost:3001/produtos/${id}`, {
      method: 'DELETE',
    });
    if (resp.ok) {
      await obterProdutos();
    }
  }

  async function obterProdutoPorId(id: number) {
    const resp = await fetch(`http://localhost:3001/produtos/${id}`);
    const data: Produto = await resp.json();
    setProduto(data);
  }

  function renderizarFormProduto() {
    return (
      <div className="flex flex-col gap-5 items-center">
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="nome">
            Nome produto
          </label>
          <input
            id="nome"
            type="text"
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            className="bg-gray-100 border-2 rounded-md p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold" htmlFor="descricao">
            Descrição
          </label>
          <input
            id="descricao"
            type="text"
            value={produto.descricao}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            className="bg-gray-100 border-2 rounded-md p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold" htmlFor="preco">
            Preço
          </label>
          <input
            id="preco"
            type="number"
            value={produto.preco}
            onChange={(e) => setProduto({ ...produto, preco: +e.target.value })}
            className="bg-gray-100 border-2 rounded-md p-2"
          />
        </div>
        <div>
          {produto.id ? (
            <button onClick={alterarProduto} className="bg-blue-500 rounded-md px-4 py-2 font-bold">
              Alterar Produto
            </button>
          ) : (
            <button onClick={criarProduto} className="bg-blue-500 rounded-md px-4 py-2 font-bold">
              Criar Produto
            </button>
          )}
        </div>
      </div>
    );
  }

  function renderizarProdutos() {
    return (
      <div className="flex flex-col gap-2">
        {produtos.map((produto) => (
          <div key={produto.id} className="flex px-4 py-2 items-center gap-2 bg-gray-100 p-2 rounded-md">
            <div className="flex-1 font-bold">{produto.nome}</div>
            <div>{produto.preco}</div>

            <div>
              <button
                onClick={() => obterProdutoPorId(produto.id!)}
                className="p-2 bg-green-500 rounded-md"
              >
                Alterar
              </button>

              <button
                onClick={() => excluirProduto(produto.id!)}
                className="p-2 bg-red-500 rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen gap-30">
      <div className="bg-blue-400 py-6 px-8 rounded-xl">{renderizarFormProduto()}</div>

      <div className="bg-blue-400 py-6 px-8 rounded-xl">{renderizarProdutos()}</div>
    </div>
  );
}
