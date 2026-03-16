import HeaderMenu from "@/components/HeaderMenu";
import { exportBackup, importBackup } from "@/utils/backup";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as appService from "../services/appService";


export default function Layout() {

    useEffect(() => {
        appService.initializeApp();
    }, []);

    return (
        <Stack
            screenOptions={{
                headerTitle: "Ngöndro Tracker",

                headerRight: () => (
                    <HeaderMenu
                        onExport={exportBackup}
                        onImport={importBackup}
                    />
                )
            }}
        />
    );

}