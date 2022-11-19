import React, {useCallback, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {API_URL, URL_Geocoding} from "../app/config";

interface IData {
    isLoading: boolean,
    city: string,
    setCity: React.Dispatch<React.SetStateAction<string>>,
    cities: string[],
    setCities:  React.Dispatch<React.SetStateAction<string[]>>,
    error: string,
    setError:  React.Dispatch<React.SetStateAction<string>>,
    resCity: string,
    resCountry: string,
    data:  AxiosResponse<any, any>[],
    getData: (city?: string) => Promise<void>
}

export function useData(): IData {
    const [isLoading, setLoading] = useState(false)
    const [city, setCity] = useState('')
    const [resCountry, setResCountry] = useState('')
    const [resCity, setResCity] = useState('')
    const [cities, setCities] = useState<string[]>([])
    const [data, setData] = useState([])
    const [error, setError] = useState('')


    const getData = useCallback(async (defaultCity = "Moscow") => {
        try {
            setLoading(true)
            const responseGeo = await axios.get(URL_Geocoding, {
                headers: {
                    'Content-type': 'Application/json'
                },
                params: {
                    q: `${city ? city.trim() : defaultCity}`
                }
            })
            const latCity = responseGeo.data[0].lat
            const lonCity = responseGeo.data[0].lon
            setResCity(responseGeo.data[0].local_names.ru)
            setResCountry(responseGeo.data[0].country)

            if (latCity && lonCity) {
                try {
                    const response = await axios.get(API_URL, {
                        params: {
                            lat: latCity,
                            lon: lonCity,
                            exclude: "hourly,minutely"
                        }
                    })
                    if (response.status === 200) {
                        setLoading(false)
                        if (city) {
                            if (!cities.includes(city)) {
                                setCities(prevState => ([
                                    ...prevState,
                                    city
                                ]))
                            }
                        }
                        setCity('')
                        setData(response.data.daily)
                    }
                } catch (e) {
                    setLoading(false)
                    setError('Error!')
                }
            }

        } catch (error) {
            setLoading(false)
            setError('City not found')
        }
    }, [city, cities])

    return {
        isLoading,
        city,
        setCity,
        cities,
        setCities,
        error,
        setError,
        resCity,
        resCountry,
        data,
        getData
    }
}
