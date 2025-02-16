import React from "react";
import { Link } from "react-router-dom";
import './MediumCardItem.css'

export default function MediumCardItem(props) {
    // console.log("From MediumCardItem: " + JSON.stringify(props));
    let MediumCardData = props['MediumCardDetails'];
    console.log("From MediumCardItem: " + JSON.stringify(MediumCardData));
    // if (MediumCardData['caption'].length > 25) {
    //     MediumCardData['caption'] = MediumCardData['caption'].slice(0, 25) + '...';
    // }

    let bgImage = '';

    if (MediumCardData['image'] != 'No image available') {
        bgImage = `url(${MediumCardData['image']})`;
    }
    else {
        let bgImages = [
            "../../../image/bgImage1.wepg",
            "../../../image/bgImage2.wepg",
            "../../../image/bgImage3.wepg",
            "../../../image/bgImage4.wepg",
            "../../../image/bgImage5.wepg"
        ];
        
        bgImage = `url(${bgImages[Math.floor(Math.random() * bgImages.length)]})`;
    }
    const backgroundImageStyle = {
        backgroundImage: bgImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '90%',
        // height: '100%',
        borderRadius: '5px',
    }

    // let hello = {
    //     "id":"0bTdYMSrhA1Z6oMXrqDyvX",
    //     "name":"Freaking out ",
    //     "description":"#pop#hiphop#rap#rao#xxxsectiondeath #freestyle__rapper #trap__metal #2024 #new #newmusic #bandlab #vocal #singer #viral #song#beat #like #comment #follow #music #romantic #rapper #trending #producer #share #love #like #comment",
    //     "image":"https://i.scdn.co/image/ab6765630000ba8ab221a46c37b24237a1fc3c52",
    //     "total_songs":1,
    //     "spotifyUrl":"https://open.spotify.com/show/0bTdYMSrhA1Z6oMXrqDyvX",
    //     "genre":"mixed",
    //     "type":"podcast"
    // }

    return (
        <>
            <Link to={`/playlist/public/${MediumCardData.id}`} className="medium_card_item dff">
                <div className="medium_card_img_container df" style={backgroundImageStyle}>
                    <div className="medium_card_name_container">
                        
                    </div>
                    <div className="medium_card_play_pause_btn_container dff">
                        <i className="fa-solid fa-play medium_card_play_pause_btn"></i>
                    </div>
                </div>
                <div className="medium_card_content_container">
                    { MediumCardData.name }
                </div>
            </Link>
        </>
    )
}