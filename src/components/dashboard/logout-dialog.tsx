"use client"
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"

import { toast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DialogAddProp {
    isOpen: boolean;
    handleLogout: () => void;
    onClose: () => void;
}

const LogoutDialog: React.FC<DialogAddProp> = ({ isOpen, onClose, handleLogout }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogoutButton = async () => {
        setIsLoading(true)
        handleLogout();
        toast({ title: "Logout successful" });
    }

    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Do you want to logout?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    {!isLoading ? <Button type="submit" onClick={handleLogoutButton}
                        disabled={isLoading}
                    >Logout
                    </Button> : <Spinner />}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutDialog;