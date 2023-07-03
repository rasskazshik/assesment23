import React from 'react';
import './Card.css';

export default function Card({title,text,target,linkTitle,href,rel,onClick,linkClassName})
{
    // не уверен что следует делать с классами, добавил файл со стилями для них и немного стилизовал.
    // Кроме того смущает default-link - не по БЭМ, его полностью можно заменить использованием card__link как класса по умолчанию, поэтому удалил
    return (
        <div className="card">

            <div className="card__title">{title}</div>

            <div className="card__text">{text}</div>
            <a className={`card__link ${linkClassName}`} target={target} rel={rel} href={href} onClick={onClick}>
                {linkTitle}
            </a>
        </div>
    );
}