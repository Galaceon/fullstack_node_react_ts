import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        
        info: {
            title: 'REST API Node.js / Express / TypeScrypt',
            version: "1.0.0",
            description: "API Docs for Products"
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link {
            content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
            height: 90px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #61AFFE;
        }
        html.dark-mode .swagger-ui .topbar {
            background-color: #182536;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / Typescript'
}

export default swaggerSpec
export {
    swaggerUiOptions
}