import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { PrismaSelect } from 'src/common/types';
import { CurrentUser, SelectFields } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextUser } from 'src/common/entities/ContextUser';
import { ValidRoles } from 'src/common/enum/valid-roles.enum';

@UseGuards(JwtAuthGuard)
@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => [Company], { name: 'companyFindAll' })
  findAll(@SelectFields() select: PrismaSelect) {
    return this.companyService.findAll(select);
  }

  @Query(() => Company, { name: 'companyFindOne' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @SelectFields() select: PrismaSelect,
  ) {
    return this.companyService.findOne(id, select);
  }

  @Mutation(() => Boolean, { name: 'companyCreate' })
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
    @CurrentUser([ValidRoles.ROOT]) user: ContextUser,
  ) {
    return this.companyService.create(createCompanyInput);
  }

  @Mutation(() => Boolean, { name: 'companyUpdate' })
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
    @CurrentUser([ValidRoles.ROOT]) user: ContextUser,
  ) {
    return this.companyService.update(
      updateCompanyInput.id,
      updateCompanyInput,
    );
  }

  @Mutation(() => Boolean, { name: 'companyRemove' })
  removeCompany(@Args('id', { type: () => String }) id: string) {
    return this.companyService.remove(id);
  }
}
