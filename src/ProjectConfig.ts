export class ProjectConfig {
    static readonly projectName = "BetterOnlineQuestBook";
    static readonly projectName_zh = "Meilleur livre de quêtes en ligne";
    static readonly projectNm = "BOQB";
    static readonly projectDsc_zh = "Vous avez oublié le nom d'une quête et ne pouvez pas lancer le jeu ? Essayez le livre de quêtes en ligne !";
    static readonly projectDsc = "Un livre de quêtes en ligne pratique quand vous ne vous souvenez plus quelle quête suivre !";
    static readonly projectVersion = "1.0.3";
    static readonly projectDescription = "BetterOnlineQuestBook";
    static readonly projectAuthor = ["MCTBL", "Grievous_Rain"];
    static readonly versionList = ["2.8.4", "2.8.0", "2.7.2"];
    static readonly resList = ["284", "280", "272"];
    static readonly questLinePath = "quest_line.json";
    static readonly questDataPath = "quest_json";
    static readonly projectUrl = "https://github.com/MCTBL/Better_Online_QuestBook";

    static readonly atlasPath = "quests_icons.json";
}
(window as any).ProjectConfig = ProjectConfig;
