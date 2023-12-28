import React, { useEffect, useState } from 'react'
import scss from './card.module.scss'
import axios from 'axios'
import { URL_POKEMON, URL_ESPECIES, URL_EVOLUCIONES } from '../../../api/apiRest'

export default function Card({card}) {
  
  //useState is a Hook that allows you to have state variables in functional components.
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});
  const [evoluciones, setEvoluciones] = useState([]);


  console.log(itemPokemon);

  //UseEffect is a hook that allows you to perform side effects in functional components.
  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);

      setItemPokemon(api.data);
    };

    dataPokemon();
  }, [card]);


  useEffect(() => {
    const especiePokemon = async () => {
      //Get array of URL elements
      const URL = card.url.split("/");

      //Get sixth element of array (id pokemon)
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
    
      //Set itemPokemon with data of api
      setEspeciePokemon({
        url_especie: api?.data?.evoluction_chain,
        data: api.data
      });
    };

    especiePokemon();
  }, [card]);


  useEffect(() => {
    
    async function getImage(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`)

      return response.data.sprites.other["official-artwork"].front_default;
    }

    if(especiePokemon?.url_especie){
      
      const evolutions = [];

      const URL = especiePokemon.url_especie.split("/");
      
      const getEvolutions = async () => {
        const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);
  
        const URLtmp = api?.data?.chain?.species?.url?.split("/");

        const img1 = await getImage(URLtmp[6]);

        evolutions.push({
          img: img1,
          name: api?.data?.chain?.species?.name
        });

        if(api?.data?.chain?.evolves_to?.length != 0){
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2?.url?.split("/")[6];
          const img2 = await getImage(ID);

          evolutions.push({
            img: img2,
            name: DATA2?.name
          });

          if (api?.data?.chain.evolves_to[0].evolves_to.length !== 0) {
            const DATA3 = api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
            const ID = DATA3?.url?.split("/")[6];
            const img3 = await getImage(ID);

            evolutions.push({
              img: img3,
              name: DATA3?.name,
            });
        }
      }
    }

    setEvoluciones(evolutions);

    getEvolutions();
   }
  }, [especiePokemon]);

  let pokemonId = itemPokemon?.id?.toString();

  if(pokemonId?.length === 1){
     pokemonId = "00" + pokemonId;
  } else if(pokemonId?.length === 2){
      pokemonId = "0" + pokemonId
  } else {
    pokemonId;
  }


  return (
    <div className={scss.card}>
      <img className={scss.imgPokemon} src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} alt="Pokemon" /> 
      <div className={`bg-${especiePokemon?.data?.color?.name} ${scss.subCard}`}>
        <strong className={scss.idCard}> {pokemonId} </strong>
        <strong className={scss.nameCard}> {itemPokemon.name} </strong>
        <h4 className={scss.heightCard}> Height: {itemPokemon.height}0 cm </h4>
        <h4 className={scss.weightCard}> Weight: {itemPokemon.weight} kg </h4>
        <h4 className={scss.habitatCard}> Habitat: {especiePokemon?.data?.habitat?.name} </h4>

        <div className={scss.divStats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return (
              <h6 key={index} className={scss.itemStats}>
                <span className={scss.name}>{sta.stat.name}</span>
                <progress value={sta.base_stat} max={110} />
                <span className={scss.number}>{sta.base_stat}</span>
              </h6>)
          })}
        </div>

        <div className={scss.divColorType}>
          {itemPokemon?.types?.map((type, index) => {
            return (
              <h6 key={index} className={`color-${type.type.name} ${scss.colorType}`}>
                <span className={scss.name}>{type.type.name}</span>
              </h6>)
          })}
        </div>

        <div>
          {
            evoluciones.map(evo => {
              return(
                <div>
                  <img src={evo.img} alt="" />
                  <h6> {evo.name} </h6>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
