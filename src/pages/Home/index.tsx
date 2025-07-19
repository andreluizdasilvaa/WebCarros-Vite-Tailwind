import React from "react";
import { Container } from "../../components/container"
import { 
    collection,
    getDocs,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router";

interface CarProps {
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    images: CarImageProps[];
}

interface CarImageProps {
    name: string;
    uid: string;
    url: string;
}

export function Home() {
    const [cars, setCars] = React.useState<CarProps[]>([])
    const [loadImages, setLoadImages] = React.useState<string[]>([])
    const [input, setInput] = React.useState('')

    React.useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        const carsRef = collection(db, 'cars');
        const queryRef = query(carsRef, orderBy('created', 'desc'))

        await getDocs(queryRef)
        .then((snapShot) => {
            let listCars = [] as CarProps[];

            snapShot.forEach( doc => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    city: doc.data().city,
                    price: doc.data().price,
                    images: doc.data().images,
                    uid: doc.data().uid
                })
            })

            setCars(listCars);
        })
    };

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
    }

    async function handleSearchCar() {
        if(input === '') {
            loadCars();
            return;
        }

        setCars([]);
        setLoadImages([]);

        const q = query(collection(db, 'cars'),
            where('name', '>=', input.toUpperCase()),
            where('name', '<=', input.toUpperCase() + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)

        let listCars = [] as CarProps[];

        querySnapshot.forEach((doc) => {
            listCars.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                km: doc.data().km,
                city: doc.data().city,
                price: doc.data().price,
                images: doc.data().images,
                uid: doc.data().uid
            })
        })

        setCars(listCars);
    }

    return (
        <Container>
            <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                <input 
                    type="text" 
                    placeholder="Digite o nome do carro..." 
                    className="w-full border-1 rounded-md h-10 px-3 outline-none border-gray-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="bg-red-500 h-10 px-8 rounded-md text-white font-bold cursor-pointer hover:bg-red-600 transition-all"
                    onClick={handleSearchCar}
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
                {cars.map( car => (
                    <Link key={car.id} to={`/car/${car.id}`}>
                        <section className="w-full bg-white rounded-lg">
                            <div className="w-full j-72 rounded-lg bg-slate-200" style={{ display: loadImages.includes(car.id) ? 'none' : 'block' }} />
                            <img 
                                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                                src={car.images[0].url}
                                alt="Carro" 
                                onLoad={() => handleImageLoad(car.id)}
                                style={{ display: loadImages.includes(car.id) ? 'block' : 'none' }}
                            />

                            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 px-2 mb-6">Ano: {car.year} | {car.km}km</span>
                                <strong className="text-black font-medium text-xl">R$ 4.000.000</strong>
                            </div>

                            <div className="w-full h-px bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-zinc-700">
                                    {car.city}
                                </span>
                            </div>
                        </section>
                    </Link>
                ))}

            </main>
        </Container>
    )
}