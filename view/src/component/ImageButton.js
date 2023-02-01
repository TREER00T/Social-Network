function ImageButton({className, onClick, onChange, innerRef, src}) {

    return (
        <div
            className={className + ' w-10 h-10 bg-blue-gray-50 rounded-lg drop-shadow-lg hover:cursor-pointer'}
            onChange={onChange}
            ref={innerRef}
            onClick={onClick}>
            <img src={src} className="m-2" alt="Icon"/>
        </div>
    );

}

export default ImageButton;