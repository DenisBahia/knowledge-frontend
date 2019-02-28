<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração"
            sub="Cadastros & Cia" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Artigos" active>
                        <ArticleAdmin />
                    </b-tab>
                    <b-tab title="Categorias">
                        <CategoryAdmin />
                    </b-tab>
                    <b-tab title="Usuários">
                        <UserAdmin />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from "../template/pageTitle"
import UserAdmin from "./userAdmin"
import ArticleAdmin from "./articleAdmin"
import CategoryAdmin from "./categoryAdmin"

export default {
    name: "AdminPages",
    components: {PageTitle, UserAdmin, CategoryAdmin, ArticleAdmin}
}
</script>

<style>

</style>
