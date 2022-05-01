import './index.css'

export default function EventModal({ setEventModal, event }) {
    const events = {
        'Big': 'Yeah! You have delivered everything and did great job!',
        'Middle': 'You have delivered humanitarian, but, lost half of it. Cry man, it is okay.',
        'Basic': 'Heh, you tried to deliver humanitarian, but because of rockets and bombs you have lost your humanitarian and was wounded!',
    }

    return (
        <div className="event-modal-background">
            <div className="event-modal-wrapper">
                <div className="event-modal">
                    <p className="event-description">
                        {events[event.event]}
                    </p>
                    <div className="event-stats">
                        <p className="event-stats-exp">
                            Experience: +{event.event_experience}
                        </p>
                        <p className="event-stats-hp">
                            Health: -{event.event_health}
                        </p>
                    </div>
                    <button onClick={() => setEventModal(false)}>Ok</button>
                </div>
            </div>
        </div>
    )
}