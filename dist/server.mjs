import {
  getEvent
} from "./chunk-DLIX6Z7G.mjs";
import {
  registerForEvent
} from "./chunk-I7Q23BS5.mjs";
import {
  errorHandler
} from "./chunk-TNC57AZS.mjs";
import {
  checkin
} from "./chunk-NRT7L3K5.mjs";
import {
  createEvent
} from "./chunk-A2XTB45W.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-AJPZ7JVW.mjs";
import "./chunk-5B4TKFIG.mjs";
import {
  getEventAttendees
} from "./chunk-HYZXW5JR.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
  //permitindo que qualquer aplicação possa consumir essa api (provisório)
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    //todos os dados que vão ser enviados para api deve ser no formato de json
    produces: ["application/json"],
    //resultados também em json
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW unite da Rockseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
  //url para chamar o swagger ui com o localhost
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkin);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3323, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});
export {
  app
};
