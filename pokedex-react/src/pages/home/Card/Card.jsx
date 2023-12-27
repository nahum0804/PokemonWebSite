import React, { useEffect, useState } from 'react'
import scss from './card.module.scss'
import axios from 'axios'
import { URL_POKEMON, URL_ESPECIES } from '../../../api/apiRest'

export default function Card({card}) {
  
  //useState is a Hook that allows you to have state variables in functional components.
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});


  console.log(itemPokemon);

  //UseEffect is a hook that allows you to perform side effects in functional components.
  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);

      setItemPokemon(api.data);
    };

    dataPokemon();
  }, []);


  useEffect(() => {
    const especiePokemon = async () => {
      //Get array of URL elements
      const URL = card.url.split("/");

      //Get sixth element of array (id pokemon)
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
    
      //Set itemPokemon with data of api
      setEspeciePokemon(api.data);
    };

    especiePokemon();
  }, []);

  return (
    <div className={scss.card}>
      <img className={scss.imgPokemon} src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} alt="Pokemon" /> 
      <div className={`bg-${especiePokemon?.color?.name} ${scss.subCard}`}>
        <strong className={scss.idCard}> {itemPokemon.id} </strong>
        <strong className={scss.nameCard}> {itemPokemon.name} </strong>
        <h4 className={scss.heightCard}> Height: {itemPokemon.height}0 cm </h4>
        <h4 className={scss.weightCard}> Weight: {itemPokemon.weight} kg </h4>
        <h4 className={scss.habitatCard}> Habitat: {especiePokemon?.habitat?.name} </h4>

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

      </div>
    </div>
  )
}
