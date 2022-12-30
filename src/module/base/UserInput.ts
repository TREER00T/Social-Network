import Util from "../../util/Util";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";

export abstract class UserInput {

    async isDefined(data: unknown) {
        if (!Util.isUndefined(data))
            return Json.builder(Response.HTTP_BAD_REQUEST);
    }

    async isUndefined(data: unknown) {
        if (Util.isUndefined(data))
            return Json.builder(Response.HTTP_BAD_REQUEST);
    }

}