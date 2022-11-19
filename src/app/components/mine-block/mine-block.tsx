import React, {useCallback, useEffect} from "react";
import styles from "./mine-block.module.css";
import {Preloader} from "../preloader/preloader";
import {Form} from "../form/form";
import {CardWeather} from "../card-weather/card-weather";
import {CityButton} from "../cityButton/cityButton";
import {useData} from "../../../hooks/useData";

export const MineBlock = (): JSX.Element => {
    const {isLoading, setCities, setError, cities, city, setCity, error, resCity, data, resCountry, getData} = useData()

    const removeCitiesFromLS = () => {
        localStorage.removeItem("cities")
        setCities([])
        getData()
    }

    const getBgColor = useCallback((city: string, c: string) => {
        return city.split(' ').pop()?.toLowerCase() === c ? "blue" : "#757575"
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        getData()
    }

    useEffect(() => {
        if (cities.length) {
            localStorage.setItem("cities", JSON.stringify(cities))
        }
    }, [cities])

    useEffect(() => {
        const citiesFromLSStr = localStorage.getItem("cities")
        const citiesFromLS: string[] = citiesFromLSStr && JSON.parse(citiesFromLSStr)
        if (citiesFromLS?.length) {
            setCities(citiesFromLS)
        }
        getData()
    }, [])

    return (
        <div className={styles.container}>
            {isLoading
                ? <Preloader/>
                : (<>
                    <Form city={city} onChange={setCity} onSubmit={handleSubmit}/>
                    {error && <h1 className={styles.error}>{error}</h1>}
                    {cities?.length
                        ? (
                            <div className={styles.cities_block}>
                                <div className={styles.cities_container}>
                                    {cities.map((c, index) => <CityButton
                                            key={index}
                                            bgColor={getBgColor(resCity, c)}
                                            text={c}
                                            onClick={() => getData(c)}
                                        />
                                    )}
                                </div>
                                <div className={styles.cities_block__remove_button}>
                                    <CityButton bgColor="#0277bd" text="удалить" onClick={removeCitiesFromLS}/>
                                </div>
                            </div>
                        )
                        : ""
                    }
                    <div className={styles.block}>
                        {data && data.map((item: any) => (
                            <CardWeather
                                key={item.dt}
                                city={resCity}
                                country={resCountry}
                                data={item}
                            />
                        ))}
                    </div>
                </>)
            }
        </div>
    )
}
