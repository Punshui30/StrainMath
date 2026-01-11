"C:\Users\simmo\Downloads\strain_library (1).json"

    * MOCK COA DATASET
        * Version: 1.0.0
            * 
 * Simulated Certificate of Analysis data for GO Calculator demo.
 * Contains realistic cannabinoid and terpene profiles for strain library cultivars.
 * 
 * ⚠️ DEMO DATA ONLY - NOT ACTUAL LAB RESULTS ⚠️
 * For educational and demonstration purposes only.
 * Real product decisions should be based on actual laboratory testing.
 * 
 * DESIGN NOTES:
 * - Terpene profiles reflect cultivar - typical characteristics
    * - THC / CBD ranges aligned with common cultivar expressions
        * - Total terpene content: 0.8 % -3.5 % (realistic range)
 * - Percentages expressed as % w / w(weight / weight)
    */

export type MockCOA = {
    strainId: string;
    strainName: string;
    batchId: string;
    cannabinoids: {
        thc: number;
        cbd: number;
        cbn: number;
        cbg: number;
    };
    terpenes: {
        name: string;
        percentage: number;
    }[];
    totalTerpenes: number;
};

export const MOCK_COAS: MockCOA[] = [
    {
        strainId: "strain_001",
        strainName: "Blue Dream",
        batchId: "BD-2024-001",
        cannabinoids: { thc: 18.5, cbd: 0.3, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Myrcene", percentage: 0.65 },
            { name: "Pinene", percentage: 0.42 },
            { name: "Caryophyllene", percentage: 0.38 },
            { name: "Limonene", percentage: 0.28 },
            { name: "Terpinolene", percentage: 0.18 },
            { name: "Linalool", percentage: 0.12 }
        ],
        totalTerpenes: 2.03
    },
    {
        strainId: "strain_002",
        strainName: "Sour Diesel",
        batchId: "SD-2024-002",
        cannabinoids: { thc: 22.3, cbd: 0.2, cbn: 0.2, cbg: 1.1 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.58 },
            { name: "Limonene", percentage: 0.52 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.15
    },
    {
        strainId: "strain_003",
        strainName: "OG Kush",
        batchId: "OG-2024-003",
        cannabinoids: { thc: 20.8, cbd: 0.1, cbn: 0.3, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.72 },
            { name: "Limonene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.45 },
            { name: "Linalool", percentage: 0.24 },
            { name: "Pinene", percentage: 0.18 }
        ],
        totalTerpenes: 2.07
    },
    {
        strainId: "strain_004",
        strainName: "Granddaddy Purple",
        batchId: "GDP-2024-004",
        cannabinoids: { thc: 17.2, cbd: 0.1, cbn: 0.8, cbg: 0.4 },
        terpenes: [
            { name: "Myrcene", percentage: 0.88 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Humulene", percentage: 0.18 }
        ],
        totalTerpenes: 2.31
    },
    {
        strainId: "strain_005",
        strainName: "Green Crack",
        batchId: "GC-2024-005",
        cannabinoids: { thc: 21.5, cbd: 0.2, cbn: 0.1, cbg: 0.9 },
        terpenes: [
            { name: "Myrcene", percentage: 0.55 },
            { name: "Caryophyllene", percentage: 0.48 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.35 },
            { name: "Terpinolene", percentage: 0.22 }
        ],
        totalTerpenes: 2.02
    },
    {
        strainId: "strain_006",
        strainName: "Girl Scout Cookies",
        batchId: "GSC-2024-006",
        cannabinoids: { thc: 19.8, cbd: 0.2, cbn: 0.2, cbg: 0.7 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Limonene", percentage: 0.48 },
            { name: "Myrcene", percentage: 0.38 },
            { name: "Linalool", percentage: 0.28 },
            { name: "Humulene", percentage: 0.24 }
        ],
        totalTerpenes: 2.0
    },
    {
        strainId: "strain_007",
        strainName: "Bubba Kush",
        batchId: "BK-2024-007",
        cannabinoids: { thc: 18.6, cbd: 0.1, cbn: 0.9, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.95 },
            { name: "Caryophyllene", percentage: 0.58 },
            { name: "Limonene", percentage: 0.32 },
            { name: "Pinene", percentage: 0.28 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 2.35
    },
    {
        strainId: "strain_008",
        strainName: "Jack Herer",
        batchId: "JH-2024-008",
        cannoids: { thc: 20.4, cbd: 0.3, cbn: 0.1, cbg: 1.0 },
        terpenes: [
            { name: "Terpinolene", percentage: 0.68 },
            { name: "Pinene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Myrcene", percentage: 0.35 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.15
    },
    {
        strainId: "strain_009",
        strainName: "Northern Lights",
        batchId: "NL-2024-009",
        cannabinoids: { thc: 16.8, cbd: 0.2, cbn: 0.7, cbg: 0.4 },
        terpenes: [
            { name: "Myrcene", percentage: 0.82 },
            { name: "Caryophyllene", percentage: 0.48 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Limonene", percentage: 0.25 },
            { name: "Linalool", percentage: 0.18 }
        ],
        totalTerpenes: 2.11
    },
    {
        strainId: "strain_010",
        strainName: "Durban Poison",
        batchId: "DP-2024-010",
        cannabinoids: { thc: 19.2, cbd: 0.1, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Terpinolene", percentage: 0.75 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Ocimene", percentage: 0.32 },
            { name: "Caryophyllene", percentage: 0.28 },
            { name: "Limonene", percentage: 0.22 }
        ],
        totalTerpenes: 2.02
    },
    {
        strainId: "strain_011",
        strainName: "Wedding Cake",
        batchId: "WC-2024-011",
        cannabinoids: { thc: 24.2, cbd: 0.1, cbn: 0.3, cbg: 0.9 },
        terpenes: [
            { name: "Limonene", percentage: 0.68 },
            { name: "Caryophyllene", percentage: 0.55 },
            { name: "Myrcene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Humulene", percentage: 0.18 }
        ],
        totalTerpenes: 2.18
    },
    {
        strainId: "strain_012",
        strainName: "Gorilla Glue #4",
        batchId: "GG4-2024-012",
        cannabinoids: { thc: 25.8, cbd: 0.1, cbn: 0.4, cbg: 1.2 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.78 },
            { name: "Myrcene", percentage: 0.65 },
            { name: "Limonene", percentage: 0.48 },
            { name: "Humulene", percentage: 0.32 },
            { name: "Pinene", percentage: 0.25 }
        ],
        totalTerpenes: 2.48
    },
    {
        strainId: "strain_013",
        strainName: "Pineapple Express",
        batchId: "PE-2024-013",
        cannabinoids: { thc: 19.5, cbd: 0.2, cbn: 0.2, cbg: 0.7 },
        terpenes: [
            { name: "Limonene", percentage: 0.62 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.09
    },
    {
        strainId: "strain_014",
        strainName: "Strawberry Cough",
        batchId: "SC-2024-014",
        cannabinoids: { thc: 17.8, cbd: 0.2, cbn: 0.1, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.58 },
            { name: "Pinene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Limonene", percentage: 0.28 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 1.98
    },
    {
        strainId: "strain_015",
        strainName: "Purple Punch",
        batchId: "PP-2024-015",
        cannabinoids: { thc: 20.2, cbd: 0.1, cbn: 0.8, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.85 },
            { name: "Caryophyllene", percentage: 0.55 },
            { name: "Limonene", percentage: 0.38 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_016",
        strainName: "White Widow",
        batchId: "WW-2024-016",
        cannabinoids: { thc: 18.9, cbd: 0.2, cbn: 0.2, cbg: 0.8 },
        terpenes: [
            { name: "Myrcene", percentage: 0.62 },
            { name: "Pinene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Limonene", percentage: 0.28 },
            { name: "Ocimene", percentage: 0.15 }
        ],
        totalTerpenes: 1.95
    },
    {
        strainId: "strain_017",
        strainName: "AK-47",
        batchId: "AK-2024-017",
        cannabinoids: { thc: 20.5, cbd: 0.2, cbn: 0.2, cbg: 0.9 },
        terpenes: [
            { name: "Terpinolene", percentage: 0.58 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Limonene", percentage: 0.25 }
        ],
        totalTerpenes: 2.12
    },
    {
        strainId: "strain_018",
        strainName: "Super Lemon Haze",
        batchId: "SLH-2024-018",
        cannabinoids: { thc: 22.8, cbd: 0.2, cbn: 0.1, cbg: 1.0 },
        terpenes: [
            { name: "Limonene", percentage: 0.88 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Myrcene", percentage: 0.42 },
            { name: "Terpinolene", percentage: 0.35 },
            { name: "Pinene", percentage: 0.28 }
        ],
        totalTerpenes: 2.45
    },
    {
        strainId: "strain_019",
        strainName: "Gelato",
        batchId: "GEL-2024-019",
        cannabinoids: { thc: 21.5, cbd: 0.1, cbn: 0.3, cbg: 0.8 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.65 },
            { name: "Limonene", percentage: 0.58 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.22
    },
    {
        strainId: "strain_020",
        strainName: "Skywalker OG",
        batchId: "SO-2024-020",
        cannabinoids: { thc: 19.8, cbd: 0.1, cbn: 0.7, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.78 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.28 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_021",
        strainName: "Trainwreck",
        batchId: "TW-2024-021",
        cannabinoids: { thc: 20.8, cbd: 0.2, cbn: 0.2, cbg: 0.9 },
        terpenes: [
            { name: "Terpinolene", percentage: 0.72 },
            { name: "Myrcene", percentage: 0.52 },
            { name: "Pinene", percentage: 0.42 },
            { name: "Limonene", percentage: 0.35 },
            { name: "Caryophyllene", percentage: 0.28 }
        ],
        totalTerpenes: 2.29
    },
    {
        strainId: "strain_022",
        strainName: "Cherry Pie",
        batchId: "CP-2024-022",
        cannabinoids: { thc: 18.4, cbd: 0.2, cbn: 0.3, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.68 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Limonene", percentage: 0.38 },
            { name: "Linalool", percentage: 0.28 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.08
    },
    {
        strainId: "strain_023",
        strainName: "Zkittlez",
        batchId: "ZK-2024-023",
        cannabinoids: { thc: 17.5, cbd: 0.1, cbn: 0.5, cbg: 0.4 },
        terpenes: [
            { name: "Myrcene", percentage: 0.72 },
            { name: "Caryophyllene", percentage: 0.55 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Humulene", percentage: 0.18 }
        ],
        totalTerpenes: 2.19
    },
    {
        strainId: "strain_024",
        strainName: "Maui Wowie",
        batchId: "MW-2024-024",
        cannabinoids: { thc: 16.2, cbd: 0.2, cbn: 0.1, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.62 },
            { name: "Limonene", percentage: 0.48 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Ocimene", percentage: 0.22 },
            { name: "Caryophyllene", percentage: 0.18 }
        ],
        totalTerpenes: 1.88
    },
    {
        strainId: "strain_025",
        strainName: "Chemdawg",
        batchId: "CD-2024-025",
        cannabinoids: { thc: 23.5, cbd: 0.1, cbn: 0.3, cbg: 1.1 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.72 },
            { name: "Myrcene", percentage: 0.58 },
            { name: "Limonene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.35 },
            { name: "Humulene", percentage: 0.28 }
        ],
        totalTerpenes: 2.38
    },
    {
        strainId: "strain_026",
        strainName: "LA Confidential",
        batchId: "LAC-2024-026",
        cannabinoids: { thc: 19.2, cbd: 0.1, cbn: 0.8, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.78 },
            { name: "Pinene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.45 },
            { name: "Linalool", percentage: 0.28 },
            { name: "Limonene", percentage: 0.22 }
        ],
        totalTerpenes: 2.25
    },
    {
        strainId: "strain_027",
        strainName: "Tangie",
        batchId: "TG-2024-027",
        cannabinoids: { thc: 19.8, cbd: 0.1, cbn: 0.1, cbg: 0.7 },
        terpenes: [
            { name: "Limonene", percentage: 0.95 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.38 },
            { name: "Pinene", percentage: 0.28 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.27
    },
    {
        strainId: "strain_028",
        strainName: "Do-Si-Dos",
        batchId: "DSD-2024-028",
        cannabinoids: { thc: 22.4, cbd: 0.1, cbn: 0.6, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.68 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_029",
        strainName: "Harlequin",
        batchId: "HAR-2024-029",
        cannabinoids: { thc: 8.5, cbd: 9.2, cbn: 0.1, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.55 },
            { name: "Pinene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.38 },
            { name: "Terpinolene", percentage: 0.22 },
            { name: "Limonene", percentage: 0.18 }
        ],
        totalTerpenes: 1.81
    },
    {
        strainId: "strain_030",
        strainName: "Sunset Sherbet",
        batchId: "SS-2024-030",
        cannabinoids: { thc: 18.8, cbd: 0.1, cbn: 0.4, cbg: 0.6 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.72 },
            { name: "Limonene", percentage: 0.58 },
            { name: "Myrcene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Humulene", percentage: 0.18 }
        ],
        totalTerpenes: 2.25
    },
    {
        strainId: "strain_031",
        strainName: "Bruce Banner",
        batchId: "BB-2024-031",
        cannabinoids: { thc: 27.2, cbd: 0.1, cbn: 0.3, cbg: 1.3 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.82 },
            { name: "Myrcene", percentage: 0.68 },
            { name: "Limonene", percentage: 0.55 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Humulene", percentage: 0.32 }
        ],
        totalTerpenes: 2.75
    },
    {
        strainId: "strain_032",
        strainName: "Purple Haze",
        batchId: "PH-2024-032",
        cannabinoids: { thc: 18.5, cbd: 0.2, cbn: 0.2, cbg: 0.7 },
        terpenes: [
            { name: "Myrcene", percentage: 0.62 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Pinene", percentage: 0.42 },
            { name: "Limonene", percentage: 0.32 },
            { name: "Ocimene", percentage: 0.22 }
        ],
        totalTerpenes: 2.1
    },
    {
        strainId: "strain_033",
        strainName: "Blueberry",
        batchId: "BB-2024-033",
        cannabinoids: { thc: 16.5, cbd: 0.2, cbn: 0.6, cbg: 0.4 },
        terpenes: [
            { name: "Myrcene", percentage: 0.88 },
            { name: "Pinene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Limonene", percentage: 0.22 }
        ],
        totalTerpenes: 2.35
    },
    {
        strainId: "strain_034",
        strainName: "Amnesia Haze",
        batchId: "AH-2024-034",
        cannabinoids: { thc: 21.8, cbd: 0.1, cbn: 0.1, cbg: 0.9 },
        terpenes: [
            { name: "Terpinolene", percentage: 0.62 },
            { name: "Caryophyllene", percentage: 0.55 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.32 }
        ],
        totalTerpenes: 2.39
    },
    {
        strainId: "strain_035",
        strainName: "Runtz",
        batchId: "RZ-2024-035",
        cannabinoids: { thc: 23.8, cbd: 0.1, cbn: 0.2, cbg: 0.9 },
        terpenes: [
            { name: "Limonene", percentage: 0.75 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Ocimene", percentage: 0.22 }
        ],
        totalTerpenes: 2.42
    },
    {
        strainId: "strain_036",
        strainName: "Critical Kush",
        batchId: "CK-2024-036",
        cannabinoids: { thc: 20.5, cbd: 0.1, cbn: 0.9, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.92 },
            { name: "Caryophyllene", percentage: 0.58 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Limonene", percentage: 0.28 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.38
    },
    {
        strainId: "strain_037",
        strainName: "Mango Kush",
        batchId: "MK-2024-037",
        cannabinoids: { thc: 17.8, cbd: 0.2, cbn: 0.3, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.82 },
            { name: "Limonene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.28 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.22
    },
    {
        strainId: "strain_038",
        strainName: "Death Star",
        batchId: "DS-2024-038",
        cannabinoids: { thc: 21.2, cbd: 0.1, cbn: 0.8, cbg: 0.7 },
        terpenes: [
            { name: "Myrcene", percentage: 0.85 },
            { name: "Caryophyllene", percentage: 0.68 },
            { name: "Limonene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.52
    },
    {
        strainId: "strain_039",
        strainName: "Candyland",
        batchId: "CL-2024-039",
        cannabinoids: { thc: 19.5, cbd: 0.2, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.68 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Myrcene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.12
    },
    {
        strainId: "strain_040",
        strainNameContinue8:09 PM: "Headband",
        batchId: "HB-2024-040",
        cannabinoids: { thc: 20.8, cbd: 0.1, cbn: 0.3, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.72 },
            { name: "Caryophyllene", percentage: 0.58 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 2.29
    },
    {
        strainId: "strain_041",
        strainName: "Mimosa",
        batchId: "MIM-2024-041",
        cannabinoids: { thc: 21.2, cbd: 0.1, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.88 },
            { name: "Myrcene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Ocimene", percentage: 0.22 }
        ],
        totalTerpenes: 2.36
    },
    {
        strainId: "strain_042",
        strainName: "Animal Cookies",
        batchId: "AC-2024-042",
        cannabinoids: { thc: 24.5, cbd: 0.1, cbn: 0.5, cbg: 1.0 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.75 },
            { name: "Limonene", percentage: 0.62 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Humulene", percentage: 0.28 }
        ],
        totalTerpenes: 2.48
    },
    {
        strainId: "strain_043",
        strainName: "Tahoe OG",
        batchId: "TOG-2024-043",
        cannabinoids: { thc: 22.5, cbd: 0.1, cbn: 0.4, cbg: 0.9 },
        terpenes: [
            { name: "Myrcene", percentage: 0.72 },
            { name: "Limonene", percentage: 0.58 },
            { name: "Caryophyllene", percentage: 0.48 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_044",
        strainName: "Acapulco Gold",
        batchId: "AG-2024-044",
        cannabinoids: { thc: 19.8, cbd: 0.2, cbn: 0.1, cbg: 0.7 },
        terpenes: [
            { name: "Myrcene", percentage: 0.58 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.35 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.05
    },
    {
        strainId: "strain_045",
        strainName: "Lemon Haze",
        batchId: "LH-2024-045",
        cannabinoids: { thc: 20.5, cbd: 0.2, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.82 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Terpinolene", percentage: 0.32 },
            { name: "Pinene", percentage: 0.28 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_046",
        strainName: "Cookies and Cream",
        batchId: "CC-2024-046",
        cannabinoids: { thc: 20.2, cbd: 0.1, cbn: 0.3, cbg: 0.7 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.68 },
            { name: "Limonene", percentage: 0.55 },
            { name: "Myrcene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.19
    },
    {
        strainId: "strain_047",
        strainName: "Master Kush",
        batchId: "MK-2024-047",
        cannabinoids: { thc: 18.2, cbd: 0.2, cbn: 0.7, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.78 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Limonene", percentage: 0.38 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 2.22
    },
    {
        strainId: "strain_048",
        strainName: "Chem Dawg #4",
        batchId: "CD4-2024-048",
        cannabinoids: { thc: 24.8, cbd: 0.1, cbn: 0.4, cbg: 1.2 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.78 },
            { name: "Myrcene", percentage: 0.62 },
            { name: "Limonene", percentage: 0.48 },
            { name: "Pinene", percentage: 0.38 },
            { name: "Humulene", percentage: 0.32 }
        ],
        totalTerpenes: 2.58
    },
    {
        strainId: "strain_049",
        strainName: "Biscotti",
        batchId: "BIS-2024-049",
        cannabinoids: { thc: 22.8, cbd: 0.1, cbn: 0.3, cbg: 0.8 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.72 },
            { name: "Limonene", percentage: 0.58 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.32
    },
    {
        strainId: "strain_050",
        strainName: "Forbidden Fruit",
        batchId: "FF-2024-050",
        cannabinoids: { thc: 18.5, cbd: 0.1, cbn: 0.6, cbg: 0.5 },
        terpenes: [
            { name: "Myrcene", percentage: 0.82 },
            { name: "Limonene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.3
    },
    {
        strainId: "strain_051",
        strainName: "Clementine",
        batchId: "CLE-2024-051",
        cannabinoids: { thc: 18.8, cbd: 0.2, cbn: 0.1, cbg: 0.7 },
        terpenes: [
            { name: "Limonene", percentage: 0.92 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Caryophyllene", percentage: 0.38 },
            { name: "Pinene", percentage: 0.28 },
            { name: "Ocimene", percentage: 0.18 }
        ],
        totalTerpenes: 2.24
    },
    {
        strainId: "strain_052",
        strainName: "Slurricane",
        batchId: "SLU-2024-052",
        cannabinoids: { thc: 21.5, cbd: 0.1, cbn: 0.7, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.88 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Limonene", percentage: 0.45 },
            { name: "Linalool", percentage: 0.35 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.52
    },
    {
        strainId: "strain_053",
        strainName: "Sour Tangie",
        batchId: "ST-2024-053",
        cannabinoids: { thc: 20.8, cbd: 0.1, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Limonene", percentage: 0.85 },
            { name: "Caryophyllene", percentage: 0.55 },
            { name: "Myrcene", percentage: 0.45 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Terpinolene", percentage: 0.22 }
        ],
        totalTerpenes: 2.39
    },
    {
        strainId: "strain_054",
        strainName: "MAC",
        batchId: "MAC-2024-054",
        cannabinoids: { thc: 23.2, cbd: 0.1, cbn: 0.2, cbg: 0.9 },
        terpenes: [
            { name: "Limonene", percentage: 0.68 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Myrcene", percentage: 0.48 },
            { name: "Linalool", percentage: 0.32 },
            { name: "Pinene", percentage: 0.28 }
        ],
        totalTerpenes: 2.38
    },
    {
        strainId: "strain_055",
        strainName: "Ice Cream Cake",
        batchId: "ICC-2024-055",
        cannabinoids: { thc: 22.5, cbd: 0.1, cbn: 0.6, cbg: 0.7 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.78 },
            { name: "Limonene", percentage: 0.62 },
            { name: "Myrcene", percentage: 0.52 },
            { name: "Linalool", percentage: 0.38 },
            { name: "Humulene", percentage: 0.25 }
        ],
        totalTerpenes: 2.55
    },
    {
        strainId: "strain_056",
        strainName: "Strawberry Banana",
        batchId: "SB-2024-056",
        cannabinoids: { thc: 19.2, cbd: 0.2, cbn: 0.3, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.72 },
            { name: "Caryophyllene", percentage: 0.52 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Linalool", percentage: 0.28 },
            { name: "Pinene", percentage: 0.22 }
        ],
        totalTerpenes: 2.16
    },
    {
        strainId: "strain_057",
        strainName: "Platinum OG",
        batchId: "POG-2024-057",
        cannabinoids: { thc: 21.8, cbd: 0.1, cbn: 0.7, cbg: 0.7 },
        terpenes: [
            { name: "Myrcene", percentage: 0.82 },
            { name: "Caryophyllene", percentage: 0.68 },
            { name: "Pinene", percentage: 0.45 },
            { name: "Limonene", percentage: 0.38 },
            { name: "Humulene", percentage: 0.25 }
        ],
        totalTerpenes: 2.58
    },
    {
        strainId: "strain_058",
        strainName: "Lemon Kush",
        batchId: "LK-2024-058",
        cannabinoids: { thc: 19.5, cbd: 0.2, cbn: 0.2, cbg: 0.7 },
        terpenes: [
            { name: "Limonene", percentage: 0.78 },
            { name: "Myrcene", percentage: 0.52 },
            { name: "Caryophyllene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Linalool", percentage: 0.22 }
        ],
        totalTerpenes: 2.26
    },
    {
        strainId: "strain_059",
        strainName: "Pink Kush",
        batchId: "PK-2024-059",
        cannabinoids: { thc: 20.8, cbd: 0.1, cbn: 0.8, cbg: 0.6 },
        terpenes: [
            { name: "Myrcene", percentage: 0.88 },
            { name: "Caryophyllene", percentage: 0.62 },
            { name: "Linalool", percentage: 0.42 },
            { name: "Pinene", percentage: 0.32 },
            { name: "Limonene", percentage: 0.28 }
        ],
        totalTerpenes: 2.52
    },
    {
        strainId: "strain_060",
        strainName: "Chiesel",
        batchId: "CHI-2024-060",
        cannabinoids: { thc: 20.2, cbd: 0.2, cbn: 0.1, cbg: 0.8 },
        terpenes: [
            { name: "Caryophyllene", percentage: 0.68 },
            { name: "Myrcene", percentage: 0.52 },
            { name: "Limonene", percentage: 0.42 },
            { name: "Pinene", percentage: 0.35 },
            { name: "Humulene", percentage: 0.22 }
        ],
        totalTerpenes: 2.19
    }
];
/**

LOOKUP HELPERS
*/
export function getCOAByStrainId(strainId: string): MockCOA | undefined {
    return MOCK_COAS.find(coa => coa.strainId === strainId);
}

export function getCOAByStrainName(strainName: string): MockCOA | undefined {
    return MOCK_COAS.find(coa => coa.strainName === strainName);
}
/**

DATASET METADATA
*/
export const COA_METADATA = {
    version: "1.0.0",
    totalCOAs: MOCK_COAS.length,
    averageTHC: (MOCK_COAS.reduce((sum, coa) => sum + coa.cannabinoids.thc, 0) / MOCK_COAS.length).toFixed(2),
    averageCBD: (MOCK_COAS.reduce((sum, coa) => sum + coa.cannabinoids.cbd, 0) / MOCK_COAS.length).toFixed(2),
    averageTotalTerpenes: (MOCK_COAS.reduce((sum, coa) => sum + coa.totalTerpenes, 0) / MOCK_COAS.length).toFixed(2),
    disclaimer: "DEMO DATA ONLY - For educational and demonstration purposes. Not actual laboratory results."
} as const;
