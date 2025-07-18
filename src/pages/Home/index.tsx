import { Container } from "../../components/container"

export function Home() {
    return (
        <Container>
            <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                <input 
                    type="text" 
                    placeholder="Digite o nome do carro..." 
                    className="w-full border-1 rounded-md h-10 px-3 outline-none border-gray-500"
                />
                <button
                    className="bg-red-500 h-10 px-8 rounded-md text-white font-bold cursor-pointer hover:bg-red-600 transition-all"
                >
                    Buscar
                </button>
            </section>

            <h1
                className="font-bold text-center mt-6 text-2xl mb-4"
            >
                Carros novos e usados em todo o brasil!
            </h1>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                <section className="w-full bg-white rounded-lg cursor-pointer">
                    <img 
                        className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                        src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202505/20250527/mclaren-750s-4-0-v8-turbo-gasolina-spider-ssg-wmimagem13580052319.webp?s=fill&w=1920&h=1440&q=75" 
                        alt="Carro" 
                    />

                    <p className="font-bold mt-1 mb-2 px-2">MCLAREN 750S</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700 px-2 mb-6">Ano: 2016/2016 | 23.000km</span>
                        <strong className="text-black font-medium text-xl">R$ 4.000.000</strong>
                    </div>

                    <div className="w-full h-px bg-slate-200 my-2"></div>

                    <div className="px-2 pb-2">
                        <span className="text-zinc-700">
                            Campo grande - MS
                        </span>
                    </div>
                </section>

            </main>
        </Container>
    )
}