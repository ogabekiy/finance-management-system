import { Global, Module } from "@nestjs/common";
import { ConfigService } from "./config/config.service";
import { AuthGuard } from "./guards/authGuards";
import { UsersModule } from "src/users/users.module";
import { AuthsModule } from "src/auths/auths.module";

@Global()
@Module({
    imports:[UsersModule,AuthsModule],
    providers:[ConfigService,AuthGuard],
    exports:[ConfigService,AuthGuard]
})

export class SharedModule{}