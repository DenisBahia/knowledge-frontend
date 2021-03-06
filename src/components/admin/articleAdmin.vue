<template>
    <div class="article-admin">
        <b-form>
            <input id="article-id" type="hidden" v-model="article.id" />
            <b-form-group label="Nome:" label-for="article-name">
                <b-form-input id="article-name" type="text"
                    v-model="article.name" required
                    :readonly="mode==='remove'"
                    placeholder="Nome do Artigo..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Descrição:" label-for="article-description">
                <b-form-input id="article-description" type="text"
                    v-model="article.description" required
                    placeholder="Descrição do Artigo..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Imagem (url):" label-for="article-imageUrl">
                <b-form-input id="article-imageUrl" type="text"
                    v-model="article.imageUrl" required
                    placeholder="Imagem do Artigo..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Categoria:" label-for="article-categoryId">
                <b-form-select id="article-categoryId" v-model="article.categoryId" :options="comboCategories" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Autor:" label-for="article-userId">
                <b-form-select id="article-userId" v-model="article.userId" :options="comboUsers" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Conteúdo:" label-for="article-content">
                <VueEditor v-model="article.content" id="article-content" placeholder="Informe o conteúdo..." />
            </b-form-group>
            <b-form-group>
                <b-button variant="primary" v-if="mode ==='save'"
                    @click="save">Salvar</b-button>
                <b-button variant="danger" v-if="mode ==='remove'"
                    @click="remove">Excluir</b-button>
                <b-button class="ml-2" 
                    @click="reset">Cancelar</b-button>
            </b-form-group>
        </b-form>
        <b-table class="mt-2" hover striped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2">
                    <i class="fa fa-pencil" />
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
                    <i class="fa fa-trash" />
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count"
            :per-page="limit" />
    </div>
</template>

<script>

import {VueEditor} from "vue2-editor"
import axios from "axios"
import {baseApiUrl, showError} from "@/global"

export default {
    name: "ArticleAdmin",
    components: {VueEditor},
    data: function() {
        return {
            mode: "save",
            article: {},
            articles: [],
            comboCategories: [],
            comboUsers: [],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                {key: "id", label: "Código", sortable: true},
                {key: "name", label: "Nome", sortable: true},
                {key: "description", label: "Descrição", sortable: true},
                {key: "actions", label: "Ações"},
            ]
        }
    },
    methods: {
        loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                this.articles = res.data.data
                this.limit = res.data.limit
                this.count = res.data.count
            })
        },
        save(){
            const method = this.article.id ? "put" : "post"
            const id = this.article.id ? `/${this.article.id}` : ""
            axios[method](`${baseApiUrl}/articles${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove(){
            const id = this.article.id
            axios.delete(`${baseApiUrl}/articles/${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset(){
            this.mode = "save"
            this.article = {}
            this.loadArticles()
        },
        loadArticle(article, mode = "save"){
            this.mode = mode
            axios.get(`${baseApiUrl}/articles/${article.id}`)
                .then(res => this.article = res.data)
        },
        loadComboCategories(){
            axios.get(`${baseApiUrl}/categories`)
                .then(res => {
                    this.comboCategories = res.data.map(category => {
                        return {value: category.id, text: category.path}
                    })
                })
        },
        loadComboUsers(){
            axios.get(`${baseApiUrl}/users`)
                .then(res => {
                    this.comboUsers = res.data.map(user => {
                        return {value: user.id, text: `${user.name} - ${user.email}`}
                    })
                })
        }
    },
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadArticles()
        this.loadComboCategories()
        this.loadComboUsers()
    }
}
</script>

<style>

</style>
