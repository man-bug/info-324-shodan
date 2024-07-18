import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// image imports
import A8810_0 from "../../public/A8810-0.jpg";
import A8812_1 from "../../public/A8812-1.jpg";
import A8814_0 from "../../public/A8814-0.jpg";
import AS_P from "../../public/AS-P.jpg";
import DesigoCc from "../../public/Desigo CC.jpg";
import EcoSmart from "../../public/EcoSmart.jpg";
import G5CE from "../../public/G5CE.jpg";
import GNU from "../../public/GNU.jpg";
import IO_30S_BM from "../../public/IO-30S-BM.jpg";
import IV20 from "../../public/IV20.jpg";
import LGR25V2 from "../../public/LGR25 V2.jpg";
import LGR25 from "../../public/LGR25.jpg";
import LiebertDS from "../../public/Liebert DS.png";
import M4_SNE11002_0 from "../../public/M4-SNE11002-0.jpg";
import M4_SNE22001_0 from "../../public/M4-SNE22001-0.jpg";
import MACH_ProWebSys from "../../public/MACH-ProWebSys.jpg";
import MNB_100002_P01_01 from "../../public/MNB_100002_P01_01.jpg";
import MS_NAE3510_2 from "../../public/MS-NAE3510-2.jpg";
import MS_NAE4510_2 from "../../public/MS-NAE4510-2.jpg";
import MS_NAE5510_1 from "../../public/MS-NAE5510-1.jpg";
import MS_NAE5510_2 from "../../public/MS-NAE5510-2.jpg";
import MS_NCE2560_0 from "../../public/MS-NCE2560-0.jpg";
import Niagara4Station from "../../public/Niagara4 Station.jpg";
import NiagaraAXStation from "../../public/NiagaraAX Station.jpg";
import OJ_Air2 from "../../public/OJ-Air2.jpg";
import PV17 from "../../public/PV17.jpg";
import PV19 from "../../public/PV19.jpg";
import QuantumBACnet from "../../public/Quantum BACnet.jpg";
import SiemensBACnetFieldPanel from "../../public/Siemens BACnet Field Panel.jpg";
import TC_BAC from "../../public/TC-BAC.jpg";
import TestModel from "../../public/TestModel.jpg";
import TracerSCPlus from "../../public/Tracer SC+.jpg";
import WC21 from "../../public/WC21.jpg";
import XT_RB from "../../public/XT-RB.jpg";
import bCX1_CR from "../../public/bCX1-CR.jpg";
import iVuCCNRouter from "../../public/i-Vu CCN Router.jpg";
import iVuOpenLink from "../../public/iVu Open Link.jpg";

export const imageMap = {
    "A8810-0": A8810_0,
    "A8812-1": A8812_1,
    "A8814-0": A8814_0,
    "AS-P": AS_P,
    "Desigo CC": DesigoCc,
    EcoSmart: EcoSmart,
    G5CE: G5CE,
    GNU: GNU,
    "IO-30S-BM": IO_30S_BM,
    IV20: IV20,
    "LGR25 V2": LGR25V2,
    LGR25: LGR25,
    "Liebert DS": LiebertDS,
    "M4-SNE11002-0": M4_SNE11002_0,
    "M4-SNE22001-0": M4_SNE22001_0,
    "MACH-ProWebSys": MACH_ProWebSys,
    MNB_100002_P01_01: MNB_100002_P01_01,
    "MS-NAE3510-2": MS_NAE3510_2,
    "MS-NAE4510-2": MS_NAE4510_2,
    "MS-NAE5510-1": MS_NAE5510_1,
    "MS-NAE5510-2": MS_NAE5510_2,
    "MS-NCE2560-0": MS_NCE2560_0,
    "Niagara4 Station": Niagara4Station,
    "NiagaraAX Station": NiagaraAXStation,
    "OJ-Air2": OJ_Air2,
    PV17: PV17,
    PV19: PV19,
    "Quantum BACnet": QuantumBACnet,
    "Siemens BACnet Field Panel": SiemensBACnetFieldPanel,
    "TC-BAC": TC_BAC,
    TestModel: TestModel,
    "Tracer SC+": TracerSCPlus,
    WC21: WC21,
    "XT-RB": XT_RB,
    "bCX1-CR": bCX1_CR,
    "i-Vu CCN Router": iVuCCNRouter,
    "iVu Open Link": iVuOpenLink,
};

export type ImageKey = keyof typeof imageMap;

export const findBestMatchingImage = (modelName: string): ImageKey | null => {
    if (!modelName || modelName === "NULL") return null;

    const normalizedModelName = modelName.toLowerCase().replace(/[^a-z0-9]/g, "");

    const variations = [
        modelName,
        modelName.replace(/\s/g, ""),
        modelName.replace(/[-\s]/g, ""),
        normalizedModelName,
    ];

    const imageKeys = Object.keys(imageMap) as ImageKey[];

    for (const variation of variations) {
        const exactMatch = imageKeys.find((key) => key.toLowerCase() === variation.toLowerCase());
        if (exactMatch) return exactMatch;
    }

    // if no exact match, try partial matches
    for (const variation of variations) {
        const partialMatch = imageKeys.find((key) =>
            key.toLowerCase().includes(variation.toLowerCase())
        );
        if (partialMatch) return partialMatch;
    }

    return null;
};
