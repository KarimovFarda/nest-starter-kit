import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export const setupSwagger = (app: INestApplication): void => {
    const options = new DocumentBuilder()
        .setTitle('Example')
        .setDescription('Example with NestJs')
        .setVersion('1.0')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT",
                description: "Enter JWT token",
                in: "header",
            },
            "JWT-auth"
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}