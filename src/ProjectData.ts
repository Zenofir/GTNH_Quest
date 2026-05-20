import { lang, quest } from "./Define";
import { ProjectConfig } from "./ProjectConfig";

export class ProjectData {
    /**语言
     * 默认为中文 */
    static language: lang = lang.zh;

    static urlParameter: Map<string, string>;
    static basicUrl: string;

    /**是否为手机 */
    static isPhone: boolean = false;

    static selectVersionIndex: number = 0;
    static getPath(url: string) {
        return "version/" + this.getVersion() + "/" + url;
    }

    static getVersion() {
        return ProjectConfig.resList[ProjectData.selectVersionIndex];
    }

    /**获取任务列表数据地址 */
    static getQuestLinePath() {
        return this.getPath(ProjectConfig.questLinePath);
    }

    static getFormatSymbolKey(versionCode: string, key: string, questNumberId: string): string {
        return `image://version/${versionCode}/quests_icons/QuestIcon/${key}/${questNumberId}`;
    }

    /**获取任务数据地址 */
    static getQuestDataPath(language: lang) {
        var questDataPath = this.getPath(ProjectConfig.questDataPath);
        if (language == lang.en) {
            questDataPath = questDataPath + "_en";
        } else if (language == lang.fr) {
            questDataPath = questDataPath + "_fr";
        }
        return questDataPath + ".json";
    }

    /**默认假任务配置 */
    static readonly fakeQuest = {
        name: 0, //顺序
        symbolSize: 0, //1.3倍
        symbol: "", //main或者notmain
        x: 0, //任务一致
        y: 0, //任务一致
        select: {
            disabled: true,
        },
        tooltip: {
            show: false,
        },
    };

    /**默认echarts配置 */
    static readonly echartsConfig = {
        backgroundColor: "#f5f0d3",
        animation: true,
        animationThreshold: 2000,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        animationDelay: 0,
        animationDurationUpdate: 300,
        animationEasingUpdate: "cubicOut",
        animationDelayUpdate: 0,
        aria: {
            enabled: false,
        },
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
        series: [
            {
                type: "graph",
                layout: "none",
                symbolSize: 10,
                circular: {
                    rotateLabel: false,
                },
                force: {
                    repulsion: 0,
                    gravity: 0,
                    edgeLength: 30,
                    friction: 0.6,
                    layoutAnimation: true,
                },
                label: {
                    show: false,
                    position: "up",
                    margin: 8,
                    valueAnimation: false,
                },
                lineStyle: {
                    show: true,
                    width: 1,
                    opacity: 1,
                    curveness: 0,
                    type: "solid",
                },
                roam: true,
                draggable: false,
                focusNodeAdjacency: true,
                data: null,
                edgeLabel: {
                    show: false,
                    margin: 8,
                    valueAnimation: false,
                },
                edgeSymbol: ["circle", "arrow"],
                edgeSymbolSize: 10,
                links: null,
                emphasis: {
                    disabled: true,
                    scale: 1,
                    focus: "None",
                },
            },
        ],
        legend: [
            {
                data: [],
                selected: {},
            },
        ],
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove|click",
            axisPointer: {
                type: "line",
            },
            showContent: true,
            alwaysShowContent: false,
            showDelay: 0,
            hideDelay: 100,
            enterable: false,
            confine: false,
            appendToBody: false,
            transitionDuration: 0.4,
            textStyle: {
                fontSize: 14,
            },
            borderWidth: 0,
            padding: 5,
            order: "seriesAsc",
        },
    };

    static readonly infoQuest: quest[] = [
        {
            title: `§9§l${ProjectConfig.projectName}§r`,
            name: "",
            symbolSize: 0,
            symbol: "logo.png",
            x: 0,
            y: 0,
            data: `§c§l${ProjectConfig.projectDsc}§r<br/><br/>§lAuteur :§r §9§l<a class="githubLink" href="https://github.com/MCTBL" target="_blank">${ProjectConfig.projectAuthor[0]}</a><img src='static/MCTBL.png'/>§r/§3§l<a class="githubLink" href="https://github.com/NoRainLand" target="_blank">${ProjectConfig.projectAuthor[1]}</a><img src='static/Norainland.png'/>§r<br/><br/>§lAdresse du projet : [url]${ProjectConfig.projectUrl}[/url]§r<br/>- Pour toute question ou demande, ouvrez une issue sur le dépôt.<br/><br/>L'icône en haut à droite permet de changer de langue, en bas à gauche d'afficher/masquer la barre latérale, et en haut à gauche se trouve la barre de recherche.<br/><br/>La §lmolette§r permet de zoomer/dézoomer sur le graphique, le §lbouton gauche§r permet de faire glisser.<br/><br/>§lRaccourcis clavier :§r<br/>§lR§r - Réinitialiser le graphique<br/>§lH§r - Afficher/masquer rapidement la barre latérale des lignes de quêtes<br/>§lÉCHAP / E§r - Fermer les détails d'une quête, ou cliquer sur la zone noire en dehors de la fenêtre.<br/>`,
            quest_id: "",
            tooltip: "",
            is_main: 0,
        },
        {
            title: `§9§l${ProjectConfig.projectName_zh}§r`,
            name: "",
            symbolSize: 0,
            symbol: "logo.png",
            x: 0,
            y: 0,
            data: `<br/>§c§l${ProjectConfig.projectDsc_zh}§r<br/><br/>§lAuteur :§r §9§l<a class="githubLink" href="https://github.com/MCTBL" target="_blank">${ProjectConfig.projectAuthor[0]}</a><img src='static/MCTBL.png'/>§r、 §3§l<a class="githubLink" href="https://github.com/NoRainLand" target="_blank">${ProjectConfig.projectAuthor[1]}</a><img src='static/Norainland.png'/>§r<br/><br/>§lAdresse du projet : [url]${ProjectConfig.projectUrl}[/url]§r<br/>- Pour toute question ou demande, ouvrez une issue sur le dépôt.<br/><br/><br/><br/>La §lmolette§r permet de zoomer/dézoomer sur le graphique, le §lbouton gauche§r permet de faire glisser.<br/><br/>§lRaccourcis clavier :§r<br/>§lR§r - Réinitialiser le graphique<br/>§lH§r - Afficher/masquer rapidement la barre latérale des lignes de quêtes<br/>§lÉCHAP / E§r - Fermer les détails d'une quête, ou cliquer sur la zone noire en dehors de la fenêtre.<br/><br/>`,
            quest_id: "",
            tooltip: "",
            is_main: 0,
        },
    ];
}
