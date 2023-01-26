import ListOfChatTabView from "pages/home/ListOfChatTabView";

function ListOfChat({dataSearched, hasSearchViewOpen}) {

    return (
        <div className="flex flex-col ml-3">

            <ListOfChatTabView dataSearched={dataSearched} hasSearchViewOpen={hasSearchViewOpen}/>

        </div>
    );

}

export default ListOfChat;