function ImageButton({className, onClick, onChange, innerRef, src}) {

    return (
        <div
            className={className + ` w-10 h-10 rounded-lg drop-shadow-lg hover:cursor-pointer ${className?.search('bg-white') >= 0 ? '' : 'bg-blue-gray-50'}`}
            onChange={onChange}
            ref={innerRef}
            onClick={onClick}>
            <img src={src} className="m-2" alt="Icon"/>
        </div>
    );

}

export default ImageButton;