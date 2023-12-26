import React, { useEffect, useState } from 'react'
import scss from '../layout/layout.module.scss'
import Header from '../header/Header'
import axios from 'axios'
import { URL_POKEMON } from '../../../api/apiRest';
import Card from '../Card/Card';

export default function LayoutHome() {

  //useState is a Hook that allows you to have state variables in functional components.
  const [arrayPokemon, setArrayPokemon] = useState([])

  console.log(arrayPokemon);

  //UseEffect is a hook that allows you to perform side effects in functional components.
  //Use for call API 
  useEffect(() => { 
    const api = async () => {
      const apiPokemon = await axios.get(`${URL_POKEMON}`);  
      
      setArrayPokemon(apiPokemon.data.results);
    }

    api();
  }, [])

  return (
    <div className={scss.layuot}>
      <Header/>
      <div>
        {arrayPokemon.map((card, index) => {
          return <Card key={index} card={card} />;
        })}
      </div>
    </div>
  )
}
