import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../services/firebaseConnection";
import { Container } from "../../components/container";
import { FaWhatsapp } from 'react-icons/fa';

import { SwiperSlide, Swiper } from 'swiper/react';

interface CarProps {
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    model: string;
    telephone: string;
    description: string;
    created: string;
    owner: string;
    images: CarImageProps[];
}

interface CarImageProps {
    name: string;
    uid: string;
    url: string;
}

export function CarDetails() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [car, setCar] = useState<CarProps>()
    const [sliderPerView, setSliderPerView] = React.useState<number>(2)

    React.useEffect(() => {
        async function loadCar() {
            if(!id) return;

            const docRef = doc(db, 'cars', id);
            getDoc(docRef)
            .then((snapshot) => {

                if(!snapshot.data()) {
                    navigate("/")
                }
                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    price: snapshot.data()?.price,
                    city: snapshot.data()?.city,
                    telephone: snapshot.data()?.telephone,
                    description: snapshot.data()?.description,
                    created: snapshot.data()?.created,
                    owner: snapshot.data()?.owner,
                    uid: snapshot.data()?.uid,
                    images: snapshot.data()?.images
                })
            })
        }

        loadCar();
    }, []);

    React.useEffect(() => {
        function handleResize() {
            if(window.innerWidth < 720) {
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);


    return (
        <Container>
            {car && (
                <Swiper
                    slidesPerView={sliderPerView}
                    pagination={{ clickable: true }}
                    navigation
                >
                    {car?.images.map(image => (
                        <SwiperSlide key={image.uid}>
                            <img 
                                src={image.url} 
                                className="w-full h-96 object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            { car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                        <h1 className="font-bold text-3xl text-black">R${car?.price}</h1>
                    </div>
                    <p>{car?.model}</p>

                    <div className="flex w-full gap-6 my-4">
                        
                        <div className="flex flex-col ga-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>
                        </div>

                        <div className="flex flex-col ga-4">
                            <div>
                                <p>Km</p>
                                <strong>{car?.km}</strong>
                            </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">{car?.description}</p>

                    <a 
                        href={`https://api.whatsapp.com/send?phone=${car.telephone}&text=Óla ví seu carro ${car.name} pelo WebCarros e fique interessado`}
                        className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
                    >
                        Falar com o vendedor
                        <FaWhatsapp size={26} color="#fff" />
                    </a>
                </main>
            )}
        </Container>
    )
}