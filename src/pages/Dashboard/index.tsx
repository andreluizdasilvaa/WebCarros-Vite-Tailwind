import React from "react"
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelHeader"
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { FiTrash } from "react-icons/fi";

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

export function Dashboard() {
    const { user } = React.useContext(AuthContext);
    const [cars, setCars] = React.useState<CarProps[]>([])
    const [loadImages, setLoadImages] = React.useState<string[]>([])

    React.useEffect(() => {
        async function loadCars() {
            if(!user?.uid) {
                return;
            }

            const carsRef = collection(db, 'cars');
            const queryRef = query(carsRef, where('uid', '==', user.uid), orderBy('created', 'desc'))

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

        loadCars();

    }, []);

    async function deleteCar(id: string) {
        const docRef = doc(db, 'cars', id)
        await deleteDoc(docRef);

        // Aqui deletaria a imagem da cloudflare, porem como não tenho back-end isso não é possivel com unsignature

        setCars(cars.filter(car => car.id !== id));
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
    }
    return (
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 mt-6 md:grid-cols2 lg:grid-cols-3">

                {cars.map(car => (
                    <section className="w-full bg-white rounded-lg relative" key={car.id}>
                        <div className="w-full j-72 rounded-lg bg-slate-200" style={{ display: loadImages.includes(car.id) ? 'none' : 'block' }} />
                        <button
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center left-2 top-2 drop-shadow-2xl z-2 cursor-pointer"
                            onClick={() => deleteCar(car.id)}
                        >
                            <FiTrash size={26} color="#000" />
                        </button>
                        <img 
                            className="w-full rounded-lg mb-2 max-h-72"
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
                ))}
            </main>
        </Container>
    )
}