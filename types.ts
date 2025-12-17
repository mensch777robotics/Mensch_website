export interface Robot {
    id: string;
    name: string;
    tagline: string;
    description: string;
    image: string;
    specs: {
        label: string;
        value: string;
    }[];
    features: string[];
    category: 'Service' | 'Education' | 'Research';
    accentColor: string;
}

export interface NavItem {
    label: string;
    path: string;
}