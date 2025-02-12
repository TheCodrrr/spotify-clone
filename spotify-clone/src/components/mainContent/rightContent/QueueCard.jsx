import React from 'react'
import './QueueCard.css'

export default function QueueCard() {
    let queue_song_details = {
        song_image: '',
        song_name: 'Bekhayali (From "Kabir Singh")',
        song_singers: 'Sachet Tandon, Sachet-Parampara',
    }
    if (queue_song_details.song_name.length > 18) {
        queue_song_details.song_name = queue_song_details.song_name.slice(0, 18) + '...';
    }
    if (queue_song_details.song_singers.length > 18) {
        queue_song_details.song_singers = queue_song_details.song_singers.slice(0, 18) + '...';
    }

    return (
        <>
            <div className="queue_card dff">
                <div className="queue_card_head_container df-ai">
                    <h5 className="queue_card_head">
                        Next in queue
                    </h5>
                    <button className="btn_queue_card_navigate dff">
                        Open Queue
                    </button>
                </div>
                <div className="queue_card_item_container dff">
                    <div className="queue_song_img_container dff">
                        <div className="queue_song_img">

                        </div>
                    </div>
                    <div className="queue_song_details_container df-jc">
                        <h5 className="queue_song_name">
                            { queue_song_details.song_name }
                        </h5>
                        <h6 className="queue_song_singers">
                            { queue_song_details.song_singers }
                        </h6>
                    </div>
                    <div className="btn_queue_song_expand_container df-ai">
                        <button className="btn_queue_song_expand">
                            •••
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}