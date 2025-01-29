import './style.css'

function RoundContainer({ children, extraClasses }) {
    return (
        <div className={`round-container ${extraClasses || ''}`}>
            {children}
        </div>
    );
}

export default RoundContainer;
