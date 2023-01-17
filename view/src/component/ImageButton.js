function ImageButton({className, onClick, onChange, ref, src}) {

    return (
        <div
            className={className + ' bg-blue-gray-50 rounded-lg drop-shadow-lg hover:cursor-pointer'}
            onChange={onChange}
            ref={ref}
            onClick={onClick}>
            <img src={src} className="m-2" alt="Icon"/>
        </div>
    );

}

export default ImageButton;