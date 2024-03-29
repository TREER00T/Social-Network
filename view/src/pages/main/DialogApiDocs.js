import {Fragment, useState} from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import Button from "../../component/Button";

export default function DialogApiDocs({className, children}) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <Fragment>
            <span className={className +
            ' font-bold ml-7 hover:cursor-pointer'} onClick={() => handleOpen()}>
                {children}
            </span>
            <Dialog
                size="md"
                handler={handleOpen}
                open={open}>
                <DialogHeader>Api Documentation</DialogHeader>
                <DialogBody divider>
                    <Button className="mr-1 outline-none"><a
                        href="http://localhost:3000/apiDocs">Restful-Api</a></Button>
                    <Button className="outline-none"><a href="http://localhost:17892/socket-docs">Socket.io</a></Button>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue"
                        onClick={() => handleOpen()}
                        className="mr-1 outline-none">
                        <span>Cancel</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
}