/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id: 'empresa',
        title: 'Empresa',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/empresa'
    },
    {
        id: 'independiente',
        title: 'Independiente',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/independiente'
    },
    {
        id: 'documentos',
        title: 'Documentos',
        type: 'basic',
        icon: 'mat_outline:attach_file',
        link: '/archivos'
    },
    {
        id: 'empleados',
        title: 'Empleados',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/empleados'
    },
    {
        id: 'planillas',
        title: 'Planillas',
        type: 'basic',
        icon: 'mat_outline:hail',
        link: '/planillagenerados'
    },
    {
        id: 'nonimas',
        title: 'Nonimas',
        type: 'basic',
        icon: 'mat_outline:hail',
        link: '/nominasgeneradas'
    },
    {
        id: 'sgsst',
        title: 'SGSST',
        type: 'collapsable',
        icon: 'mat_outline:settings',
        children: [
            {
                id: 'formatos',
                title: 'Formatos',
                type: 'basic',
                icon: 'mat_outline:notes',
                link: '/sgsst/formatos'
            }
        ]
    },
    {
        id: 'servicios',
        title: 'Servicios',
        type: 'collapsable',
        icon: 'mat_outline:connect_without_contact',
        children: [

            {
                id: 'Asesorias',
                title: 'Asesorias',
                type: 'basic',
                icon: 'mat_outline:support_agent',
                link: '/asesorias'
            },

            {
                id: 'Examenes',
                title: 'Examenes',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/examenes'
            },
            {
                id: 'Contratos',
                title: 'Contratos',
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: '/contratos'
            },
            {
                id: 'Afiliaciones',
                title: 'Afiliaciones',
                type: 'basic',
                icon: 'mat_outline:inventory',
                link: '/afiliaciones'
            },
            {
                id: 'Liquidacion Planillas',
                title: 'Liquidacion Planillas',
                type: 'basic',
                icon: 'mat_outline:request_page',
                link: '/planillas'
            },
            {
                id: 'Incapacidades',
                title: 'Incapacidades',
                type: 'basic',
                icon: 'mat_outline:wheelchair_pickup',
                link: '/incapacidades'
            },

        ]
    },
    {
        id: 'pagos',
        title: 'Pagos',
        type: 'basic',
        icon: 'mat_outline:monetization_on',
        link: '/pagos'
    },
    // {
    //     id: 'informes',
    //     title: 'Informes',
    //     type: 'basic',
    //     icon: 'mat_outline:pending_actions',
    //     link: '/informes'
    // },
    {
        id: 'solicitudes',
        title: 'Solicitudes',
        type: 'basic',
        icon: 'mat_outline:question_answer',
        link: '/solicitudes'
    },
    // {
    //     id: 'soporte',
    //     title: 'Soporte',
    //     type: 'basic',
    //     icon: 'mat_outline:perm_phone_msg',
    //     link: '/soporte'
    // }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id: 'empresa',
        title: 'Empresa',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/empresa'
    },
    {
        id: 'empleados',
        title: 'Empleados',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/empleados'
    },
    {
        id: 'nonimas',
        title: 'Nonimas',
        type: 'basic',
        icon: 'mat_outline:hail',
        link: '/nominasgeneradas'
    },
    {
        id: 'servicios',
        title: 'Servicios',
        type: 'collapsable',
        icon: 'mat_outline:connect_without_contact',
        children: [

            {
                id: 'Asesorias',
                title: 'Asesorias',
                type: 'basic',
                icon: 'mat_outline:support_agent',
                link: '/asesorias'
            },

            {
                id: 'Examenes',
                title: 'Examenes',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/examenes'
            },
            {
                id: 'Contratos',
                title: 'Contratos',
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: '/contratos'
            },
            {
                id: 'Afiliaciones',
                title: 'Afiliaciones',
                type: 'basic',
                icon: 'mat_outline:inventory',
                link: '/afiliaciones'
            },
            {
                id: 'Liquidacion Planillas',
                title: 'Liquidacion Planillas',
                type: 'basic',
                icon: 'mat_outline:request_page',
                link: '/Liquidacion'
            },
            {
                id: 'Incapacidades',
                title: 'Incapacidades',
                type: 'basic',
                icon: 'mat_outline:wheelchair_pickup',
                link: '/incapacidades'
            },

        ]
    },
    {
        id: 'pagos',
        title: 'Pagos',
        type: 'basic',
        icon: 'mat_outline:monetization_on',
        link: '/pagos'
    },
    // {
    //     id: 'informes',
    //     title: 'Informes',
    //     type: 'basic',
    //     icon: 'mat_outline:pending_actions',
    //     link: '/informes'
    // },
    {
        id: 'solicitudes',
        title: 'Solicitudes',
        type: 'basic',
        icon: 'mat_outline:question_answer',
        link: '/solicitudes'
    },
    // {
    //     id: 'soporte',
    //     title: 'Soporte',
    //     type: 'basic',
    //     icon: 'mat_outline:perm_phone_msg',
    //     link: '/soporte'
    // }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id: 'empresa',
        title: 'Empresa',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/empresa'
    },
    {
        id: 'empleados',
        title: 'Empleados',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/empleados'
    },
    {
        id: 'nonimas',
        title: 'Nonimas',
        type: 'basic',
        icon: 'mat_outline:hail',
        link: '/nominasgeneradas'
    },
    {
        id: 'servicios',
        title: 'Servicios',
        type: 'collapsable',
        icon: 'mat_outline:connect_without_contact',
        children: [

            {
                id: 'Asesorias',
                title: 'Asesorias',
                type: 'basic',
                icon: 'mat_outline:support_agent',
                link: '/asesorias'
            },

            {
                id: 'Examenes',
                title: 'Examenes',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/examenes'
            },
            {
                id: 'Contratos',
                title: 'Contratos',
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: '/contratos'
            },
            {
                id: 'Afiliaciones',
                title: 'Afiliaciones',
                type: 'basic',
                icon: 'mat_outline:inventory',
                link: '/afiliaciones'
            },
            {
                id: 'Liquidacion Planillas',
                title: 'Liquidacion Planillas',
                type: 'basic',
                icon: 'mat_outline:request_page',
                link: '/Liquidacion'
            },
            {
                id: 'Incapacidades',
                title: 'Incapacidades',
                type: 'basic',
                icon: 'mat_outline:wheelchair_pickup',
                link: '/incapacidades'
            },

        ]
    },
    {
        id: 'pagos',
        title: 'Pagos',
        type: 'basic',
        icon: 'mat_outline:monetization_on',
        link: '/pagos'
    },
    // {
    //     id: 'informes',
    //     title: 'Informes',
    //     type: 'basic',
    //     icon: 'mat_outline:pending_actions',
    //     link: '/informes'
    // },
    {
        id: 'solicitudes',
        title: 'Solicitudes',
        type: 'basic',
        icon: 'mat_outline:question_answer',
        link: '/solicitudes'
    },
    // {
    //     id: 'soporte',
    //     title: 'Soporte',
    //     type: 'basic',
    //     icon: 'mat_outline:perm_phone_msg',
    //     link: '/soporte'
    // }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id: 'empresa',
        title: 'Empresa',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/empresa'
    },
    {
        id: 'empleados',
        title: 'Empleados',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/empleados'
    },
    {
        id: 'nonimas',
        title: 'Nonimas',
        type: 'basic',
        icon: 'mat_outline:hail',
        link: '/nominasgeneradas'
    },
    {
        id: 'servicios',
        title: 'Servicios',
        type: 'collapsable',
        icon: 'mat_outline:connect_without_contact',
        children: [

            {
                id: 'Asesorias',
                title: 'Asesorias',
                type: 'basic',
                icon: 'mat_outline:support_agent',
                link: '/asesorias'
            },

            {
                id: 'Examenes',
                title: 'Examenes',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/examenes'
            },
            {
                id: 'Contratos',
                title: 'Contratos',
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: '/contratos'
            },
            {
                id: 'Afiliaciones',
                title: 'Afiliaciones',
                type: 'basic',
                icon: 'mat_outline:inventory',
                link: '/afiliaciones'
            },
            {
                id: 'Liquidacion Planillas',
                title: 'Liquidacion Planillas',
                type: 'basic',
                icon: 'mat_outline:request_page',
                link: '/Liquidacion'
            },
            {
                id: 'Incapacidades',
                title: 'Incapacidades',
                type: 'basic',
                icon: 'mat_outline:wheelchair_pickup',
                link: '/incapacidades'
            },

        ]
    },
    {
        id: 'pagos',
        title: 'Pagos',
        type: 'basic',
        icon: 'mat_outline:monetization_on',
        link: '/pagos'
    },
    // {
    //     id: 'informes',
    //     title: 'Informes',
    //     type: 'basic',
    //     icon: 'mat_outline:pending_actions',
    //     link: '/informes'
    // },
    {
        id: 'solicitudes',
        title: 'Solicitudes',
        type: 'basic',
        icon: 'mat_outline:question_answer',
        link: '/solicitudes'
    },
    // {
    //     id: 'soporte',
    //     title: 'Soporte',
    //     type: 'basic',
    //     icon: 'mat_outline:perm_phone_msg',
    //     link: '/soporte'
    // }
];
