import React, { useContext, useState } from "react"
import { FiTrash, FiUpload } from "react-icons/fi"
import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelHeader"

import { useForm } from "react-hook-form"
import { set, z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../../../components/input"
import { showErrorToast, showSuccessToast } from "../../../ui/showToast"
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from "../../../contexts/AuthContext"
import { uploadToCloudinary } from "../../../utils/uploadToCloudnary"
import { db } from "../../../services/firebaseConnection"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router"

const schemeCarro = z.object({
  name: z.string()
    .min(2, "O nome do carro deve ter pelo menos 2 caracteres")
    .max(50, "O nome do carro deve ter no máximo 50 caracteres"),

  model: z.string()
    .min(1, "O modelo é obrigatório"),

  year: z.string()
  .regex(
    /^\d{4}\/\d{4}$/,
    "O ano deve estar no formato: 'Ano de fabricação / Ano do modelo'"
  )
  .refine((val) => {
    const [fabricacao, modelo] = val.split("/").map(Number);
    const currentYear = new Date().getFullYear();

    return (
      fabricacao >= 1900 &&
      modelo >= 1900 &&
      fabricacao <= currentYear + 1 &&
      modelo <= currentYear + 1 &&
      fabricacao <= modelo
    );
  }, {
    message: "Anos inválidos ou fora do intervalo permitido"
  }),

  km: z.string()
    .nonempty("A quilometragem é obrigatória"),

  price: z.string()
    .nonempty("O preço é obrigatório"),

  city: z.string()
    .min(2, "A cidade deve ter pelo menos 2 caracteres"),

  telephone: z.string()
    .min(1, 'O telefone é obrigatório')
    .refine((value) => /^(\d{10,11})$/.test(value), {
        message: 'Numero de telefone invalido'
    }),

  description: z.string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
});

type FormData = z.infer<typeof schemeCarro>

type Image = {
    name: string;
    uid: string;
    previewUrl: string;
    file: File; 
};

export function New() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [images, setImages] = useState<Image[]>([])
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: zodResolver(schemeCarro),
        mode: 'onChange'
    })

    async function onsubmit(data: FormData) {
        if(images.length === 0) {
            showErrorToast("Envie pelo menos uma imagem do carro.");
            return;
        }
        setLoading(true)

        try {
            // Envio das imagens se houver
            const url = await Promise.all(
                images.map(async (img) => {
                    return await uploadToCloudinary(img.file);
                })
            );

            const carListImages = images.map((car, index) => ({
                uid: car.uid,
                name: car.uid,
                url: url[index]
            }));

            // Cadastro no DB ( informações do carro )
            addDoc(collection(db, 'cars'), {
                name: data.name.toUpperCase(),
                model: data.model,
                year: data.year,
                km: data.km,
                price: data.price,
                city: data.city,
                telephone: data.telephone,
                description: data.description,
                created: new Date(),
                owner: user?.name,
                uid: user?.uid,
                images: carListImages
            })
            .then((e) => {
                showSuccessToast('Carro cadastrado com sucesso!');
                navigate('/')
            })
            .catch(() => {
                showErrorToast('Erro ao salvar informações do carro.');
                // FEATURE FUTURA: se cair aqui apagar imgs do cloudnary...
            })

            
        } catch (error) {
            showErrorToast("Erro ao enviar imagens. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        if(!user?.uid) {
            return;
        }

        // verifica se o usuário selecionou algum arquivo
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            // Verifica se o arquivo é uma imagem PNG ou JPEG
            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                const uidImage = uuidv4();
                const previewUrl = URL.createObjectURL(image); // Cria uma URL temporária para visualização

                const imageName = image.name.replace(/\s+/g, '').toLowerCase();

                // Adiciona a imagem ao estado
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: imageName,
                        uid: uidImage,
                        previewUrl: previewUrl,
                        file: image,
                    },
                ]);
            } else {
                // Se não for uma imagem válida, exibe um erro
                showErrorToast('Envie uma imagem do tipo PNG ou JPEG');
                return;
            }
        }
        e.target.value = '';
    }

    function handleDeleteImage(img:Image) {
        setImages(images.filter((car) => car.uid !== img.uid))
    }

    return (
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button
                    className="border-2 w-full rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48 sm:w-48 "
                >
                    <div className="absolute cursor-pointer">
                        {!(images.length >= 3) ? <FiUpload size={30} color="#000"/> : <p>Maximo de 3 imagens</p>}
                    </div>
                    <div className="cursor-pointer">
                        <input 
                            className="opacity-0 cursor-pointer" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFile} 
                            disabled={images.length >= 3}
                        />
                    </div>
                </button>

                {images.map((img) => (
                    <div key={img.uid} className="w-full h-32 flex items-center justify-center relative">
                        <button onClick={() => handleDeleteImage(img)} className="absolute cursor-pointer">
                            <FiTrash size={28} color="#fff" />
                        </button>
                        <img
                            src={img.previewUrl}
                            className="rounded-lg w-full h-32 flex items-center object-cover"
                            alt="Foto do carro"
                        />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex-col sm:flex-row items-start gap-2 mt-2 mb-8">
                <form className="w-full" onSubmit={handleSubmit(onsubmit)}>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input 
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input 
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                        />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-start gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano</p>
                            <Input 
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="2016/2016"
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodados</p>
                            <Input 
                                type="number"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 1230"
                            />
                        </div>
                    </div>

                    <div className="flex w-full mb-3 flex-row items-start gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / whatssap</p>
                            <Input
                                type="text"
                                register={register}
                                rules={{ maxLength: 11 }}
                                name="telephone"
                                error={errors.telephone?.message}
                                placeholder="Ex: ddd12345678"
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input 
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: Campo Grande - MS..."
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="number"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 60.000"
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea 
                            className="border-2 border-slate-200 w-full rounded-md h-26 p-2 resize-none outline-none"
                            {...register('description')}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro"
                            style={{ borderColor: errors.description && 'red'}}
                        />
                        {errors.description?.message && <p className="text-red-500">{errors.description.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Cadastrar'}
                    </button>

                </form>
            </div>
        </Container>
    )
}