import {Fragment, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export default function AgreeDialog({accessToNavigate, children, handler, getAccessToAction}) {
    const [, setAccessToAction] = useState(false);

    const handleButton = (d) => {
        setAccessToAction(d);
        getAccessToAction(d);
    };

    return (
        <Fragment>
            <Dialog
                open={accessToNavigate}
                size='xs'
                handler={handler}
                animate={{
                    mount: {scale: 1, y: 0},
                    unmount: {scale: 0.9, y: -100},
                }}>
                <DialogHeader>Warning</DialogHeader>
                <DialogBody divider>
                    {children}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue"
                        onClick={() => {
                            handleButton(false);
                            handler(!accessToNavigate);
                        }}
                        className="mr-1 outline-none">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => {
                            handleButton(true)
                            handler(!accessToNavigate);
                        }}
                        className="mr-1 outline-none">
                        <span>Delete</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
}