import {Fragment} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export function DialogException({children, visibility, handler}) {
    return (
        <Fragment>
            <Dialog
                open={visibility}
                size='xs'
                handler={handler}
                animate={{
                    mount: {scale: 1, y: 0},
                    unmount: {scale: 0.9, y: -100},
                }}>
                <DialogHeader>Error</DialogHeader>
                <DialogBody divider>
                    {children}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue"
                        onClick={() => handler()}
                        className="mr-1 outline-none">
                        <span>OK</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
}

export default DialogException;