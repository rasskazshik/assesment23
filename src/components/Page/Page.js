import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';

export default function Page () {
    const [cards, setCards] = useState();
    const [fetchError, setFetchErrorState] = useState(false);

    // передаем пустой массив зависимостей для однократного запроса, чтобы не спамить ими
    // useEffect обязана быть синхронной, поэтому зашиваем запрос во вложенную функцию
    useEffect(() => {
        const fetchData = async () => {
            // let ограничивает видимость переменной, поэтому его использование при объявлении предпочтительнее
            let data = await fetch('https://my-json-server.typicode.com/savayer/demo/posts');
            // проверяем как прошел запрос, в случае сбоя - выставляем fetchError и кидаем подробности в консоль
            if (data.ok) {
                setFetchErrorState(false);
                let json = await data.json();
                //нужен массив объектов для дальнейшей работы в компоненте
                let newDataArray = [];
                json.forEach((item) => {
                    //при переборе json рассматриваем объект
                    let newDataItem = {};
                    newDataItem.id = item.id;
                    newDataItem.title = item.title;
                    newDataItem.link_title = item.link_title;
                    newDataItem.link = item.link;
                    // проверяем наличие данных для этого кейса
                    // не уверен по поводу проверки остальных полей, по идее же мы имеем описание API для получения данных?
                    if(item.body) {
                        // т.к. нужно обрезать строку с троеточием, проверим длину этой строки для данного действия
                        if (item.body.en.length > 50) {
                            newDataItem.text = item.body.en.substr(0, 50) + '...';
                        } else {
                            newDataItem.text = item.body.en;
                        }
                    }
                    else{
                        // заглушка для отсутствующих данных
                        newDataItem.text = "Data 'item.body.en' is empty..."
                    }
                    newDataArray.push(newDataItem);
                });
                setCards(newDataArray);
            }
            else {
                console.error("HTTP error: " + data.status);
                setFetchErrorState(true);
            }
        }
        fetchData();
    },[]);

    function analyticsTrackClick(url) {
        // sending clicked link url to analytics
        console.log(url);
    }

    // условный рендер для случая проблем с запросом к данным
    if (fetchError) {
        return (
            <div>
                An error occurred while retrieving data...
            </div>
        );
    }

    // условный рендер для первичных пустых данных
    if (typeof cards === "undefined") {
        return (
            <div>
                There is no data to render... Please wait...
            </div>
        );
    }

    let content = cards.map(function (item) {
        // вынес логику из передаваемых в компонент параметров
        let currentItemLinkClassName=item.id == 1 ? 'card__link--red' : '';
        let currentItemTarget=item.id == 1 ? '_blank' : '';
        // передаем отсутствующий ключ для списка
        // анонимная функция в onClick для корректной работы трекера с пробросом параметра
        return (
            <div key={item.id}>
                <Card title={item.title.en}
                      linkTitle={item.link_title}
                      href={item.link}
                      text={item.text}
                      linkClassName={currentItemLinkClassName}
                      target={currentItemTarget}
                      onClick={() => analyticsTrackClick(item.link)}/>
            </div>
        );
    });
    return (content);
}