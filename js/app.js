// 数据存储键
const STORAGE_KEY = 'reading_notes';
let currentCoverImage = '';
let currentNoteId = null;

// 书籍推荐数据库 - 共60本（中外文学20本、科技20本、金融20本）
const BOOK_RECOMMENDATIONS = [
    // ========== 中外文学（20本）==========
    {
        id: 'rec1',
        title: '活着',
        author: '余华',
        category: '文学',
        tags: ['人生', '苦难', '坚韧', '生命', '感动'],
        description: '一个人一生的故事，讲述人如何去承受巨大的苦难。',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80'
    },
    {
        id: 'rec2',
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        category: '文学',
        tags: ['魔幻现实主义', '家族', '孤独', '命运', '经典'],
        description: '布恩迪亚家族七代人的传奇故事，魔幻现实主义文学代表作。',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80'
    },
    {
        id: 'rec3',
        title: '围城',
        author: '钱钟书',
        category: '文学',
        tags: ['讽刺', '婚姻', '知识', '社会', '经典'],
        description: '城外的人想进去，城里的人想出来，人生处处是围城。',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80'
    },
    {
        id: 'rec4',
        title: '红楼梦',
        author: '曹雪芹',
        category: '文学',
        tags: ['古典', '爱情', '家族', '诗词', '经典'],
        description: '中国古典小说巅峰，封建社会的百科全书。',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80'
    },
    {
        id: 'rec5',
        title: '平凡的世界',
        author: '路遥',
        category: '文学',
        tags: ['奋斗', '人生', '时代', '励志', '现实主义'],
        description: '展示了普通人在大时代历史进程中所走过的艰难曲折的道路。',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    },
    {
        id: 'rec6',
        title: '白鹿原',
        author: '陈忠实',
        category: '文学',
        tags: ['家族', '历史', '乡土', '史诗', '中国'],
        description: '一部渭河平原五十年变迁的雄奇史诗，一轴中国农村斑斓多彩的画卷。',
        cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80'
    },
    {
        id: 'rec7',
        title: '边城',
        author: '沈从文',
        category: '文学',
        tags: ['湘西', '爱情', '纯朴', '人性', '田园'],
        description: '一曲湘西牧歌，描绘了湘西地区特有的风土人情和纯真的爱情故事。',
        cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80'
    },
    {
        id: 'rec8',
        title: '骆驼祥子',
        author: '老舍',
        category: '文学',
        tags: ['北京', '命运', '底层', '社会', '悲剧'],
        description: '讲述人力车夫祥子三起三落的人生经历，展现旧北京底层人民的苦难生活。',
        cover: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=300&q=80'
    },
    {
        id: 'rec9',
        title: '傲慢与偏见',
        author: '简·奥斯汀',
        category: '文学',
        tags: ['爱情', '婚姻', '阶级', '英国', '经典'],
        description: '19世纪英国乡绅阶层的生活画卷，关于爱情与婚姻的永恒经典。',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80'
    },
    {
        id: 'rec10',
        title: '简爱',
        author: '夏洛蒂·勃朗特',
        category: '文学',
        tags: ['女性', '独立', '爱情', '尊严', '成长'],
        description: '一个平凡女子追求独立、尊严和真爱的动人故事，女性文学的经典之作。',
        cover: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=300&q=80'
    },
    {
        id: 'rec11',
        title: '红与黑',
        author: '司汤达',
        category: '文学',
        tags: ['野心', '爱情', '社会', '法国', '批判'],
        description: '一部关于野心与爱情的悲剧，深刻揭示了复辟王朝时期法国的社会矛盾。',
        cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&q=80'
    },
    {
        id: 'rec12',
        title: '巴黎圣母院',
        author: '雨果',
        category: '文学',
        tags: ['爱情', '美丑', '宗教', '法国', '哥特'],
        description: '在15世纪的巴黎圣母院，上演了一出美与丑、善与恶的永恒悲剧。',
        cover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&q=80'
    },
    {
        id: 'rec13',
        title: '老人与海',
        author: '海明威',
        category: '文学',
        tags: ['坚持', '勇气', '自然', '硬汉', '诺贝尔文学奖'],
        description: '人可以被毁灭，但不能被打败，关于勇气与坚持的永恒故事。',
        cover: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&q=80'
    },
    {
        id: 'rec14',
        title: '了不起的盖茨比',
        author: '菲茨杰拉德',
        category: '文学',
        tags: ['美国梦', '爱情', '奢华', '悲剧', '爵士时代'],
        description: '美国文学史上的经典，关于梦想、财富与爱情的悲剧。',
        cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&q=80'
    },
    {
        id: 'rec15',
        title: '1984',
        author: '乔治·奥威尔',
        category: '文学',
        tags: ['反乌托邦', '政治', '极权', '社会', '经典'],
        description: '反乌托邦文学的巅峰之作，对极权主义社会的深刻预言。',
        cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=300&q=80'
    },
    {
        id: 'rec16',
        title: '飘',
        author: '玛格丽特·米切尔',
        category: '文学',
        tags: ['爱情', '战争', '美国', '坚强', '经典'],
        description: '关于美国南北战争时期的爱情史诗，展现了女性的坚韧与成长。',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    },
    {
        id: 'rec17',
        title: '罪与罚',
        author: '陀思妥耶夫斯基',
        category: '文学',
        tags: ['心理', '犯罪', '道德', '俄国', '哲学'],
        description: '深刻探讨罪恶、道德与救赎的心理小说巨著。',
        cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&q=80'
    },
    {
        id: 'rec18',
        title: '安娜·卡列尼娜',
        author: '托尔斯泰',
        category: '文学',
        tags: ['爱情', '婚姻', '俄国', '社会', '经典'],
        description: '幸福的家庭都是相似的，不幸的家庭各有各的不幸。',
        cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=300&q=80'
    },
    {
        id: 'rec19',
        title: '追风筝的人',
        author: '卡勒德·胡赛尼',
        category: '文学',
        tags: ['救赎', '友谊', '背叛', '成长', '阿富汗'],
        description: '为你，千千万万遍，一个关于背叛与救赎的感人故事。',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80'
    },
    {
        id: 'rec20',
        title: '挪威的森林',
        author: '村上春树',
        category: '文学',
        tags: ['青春', '爱情', '成长', '孤独', '治愈'],
        description: '一部动人心弦的、平缓舒雅的、略带感伤的恋爱小说。',
        cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80'
    },
    // ========== 科技（20本）==========
    {
        id: 'rec21',
        title: '三体全集',
        author: '刘慈欣',
        category: '科技',
        tags: ['科幻', '宇宙', '文明', '硬科幻', '中国'],
        description: '中国科幻文学的里程碑之作，探索宇宙文明的终极奥秘。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec22',
        title: '从0到1',
        author: '彼得·蒂尔',
        category: '科技',
        tags: ['创业', '创新', '商业', '垄断', '硅谷'],
        description: 'PayPal创始人的创业哲学，揭示商业世界的运行法则和创新本质。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec23',
        title: '浪潮之巅',
        author: '吴军',
        category: '科技',
        tags: ['科技', 'IT', '商业', '历史', '趋势'],
        description: '深度剖析IT产业的发展规律，揭示科技公司的兴衰成败之道。',
        cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80'
    },
    {
        id: 'rec24',
        title: '未来简史',
        author: '尤瓦尔·赫拉利',
        category: '科技',
        tags: ['未来', '科技', '人类', 'AI', '进化'],
        description: '人类将面临怎样的未来？从智人到智神，探索人类的终极命运。',
        cover: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300&q=80'
    },
    {
        id: 'rec25',
        title: '乔布斯传',
        author: '沃尔特·艾萨克森',
        category: '科技',
        tags: ['创新', '领导力', '苹果', '科技', '传记'],
        description: '苹果公司创始人的官方传记，关于创新与完美主义的故事。',
        cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80'
    },
    {
        id: 'rec26',
        title: '黑客与画家',
        author: '保罗·格雷厄姆',
        category: '科技',
        tags: ['编程', '创业', '硅谷', '思考', '技术'],
        description: '硅谷创业教父的文集，关于编程、创业、财富与设计的深刻洞见。',
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80'
    },
    {
        id: 'rec27',
        title: '创新者的窘境',
        author: '克莱顿·克里斯坦森',
        category: '科技',
        tags: ['创新', '管理', '商业', '颠覆', '战略'],
        description: '商业管理经典，揭示为什么优秀企业在面对颠覆性创新时会失败。',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    },
    {
        id: 'rec28',
        title: '奇点临近',
        author: '雷·库兹韦尔',
        category: '科技',
        tags: ['AI', '未来', '技术', '人类', '预测'],
        description: '探讨人工智能超越人类智能的未来，科技奇点的到来意味着什么。',
        cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&q=80'
    },
    {
        id: 'rec29',
        title: '深度学习',
        author: '伊恩·古德费洛',
        category: '科技',
        tags: ['AI', '机器学习', '算法', '技术', '人工智能'],
        description: '深度学习领域的圣经，全面介绍深度学习的理论基础和实践应用。',
        cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&q=80'
    },
    {
        id: 'rec30',
        title: '代码大全',
        author: '史蒂夫·迈克康奈尔',
        category: '科技',
        tags: ['编程', '软件工程', '技术', '开发', '经典'],
        description: '软件开发的百科全书，程序员必读的经典之作。',
        cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&q=80'
    },
    {
        id: 'rec31',
        title: '人月神话',
        author: '弗雷德里克·布鲁克斯',
        category: '科技',
        tags: ['软件工程', '项目管理', '技术', '经典', '开发'],
        description: '软件开发领域的经典著作，揭示软件项目管理的本质。',
        cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&q=80'
    },
    {
        id: 'rec32',
        title: '硅谷之火',
        author: '迈克尔·斯韦因',
        category: '科技',
        tags: ['硅谷', '计算机', '历史', '创新', '革命'],
        description: '讲述个人电脑诞生和发展的历史，科技爱好者的必读书。',
        cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80'
    },
    {
        id: 'rec33',
        title: '科技想要什么',
        author: '凯文·凯利',
        category: '科技',
        tags: ['技术', '未来', '哲学', '趋势', '思考'],
        description: '探讨技术的本质和发展规律，预测未来科技的发展方向。',
        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80'
    },
    {
        id: 'rec34',
        title: '算法导论',
        author: '托马斯·科尔曼',
        category: '科技',
        tags: ['算法', '编程', '计算机', '数学', '技术'],
        description: '算法领域的权威教材，计算机专业学生的必读经典。',
        cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&q=80'
    },
    {
        id: 'rec35',
        title: '黑客与画家续篇',
        author: '保罗·格雷厄姆',
        category: '科技',
        tags: ['创业', '思考', '技术', '财富', '未来'],
        description: '硅谷创业教父的更多思考，关于技术、财富与未来的洞见。',
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80'
    },
    {
        id: 'rec36',
        title: '人工智能：一种现代方法',
        author: '斯图尔特·罗素',
        category: '科技',
        tags: ['AI', '人工智能', '技术', '算法', '未来'],
        description: '人工智能领域的标准教材，全面介绍AI的理论和应用。',
        cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&q=80'
    },
    {
        id: 'rec37',
        title: '信息简史',
        author: '詹姆斯·格雷克',
        category: '科技',
        tags: ['信息', '历史', '技术', '通信', '科学'],
        description: '从非洲鼓声到互联网，讲述信息传播的历史和未来。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec38',
        title: '失控',
        author: '凯文·凯利',
        category: '科技',
        tags: ['系统', '未来', '技术', '生物学', '复杂性'],
        description: '探讨复杂系统、生物进化和技术发展的关系，预测未来趋势。',
        cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&q=80'
    },
    {
        id: 'rec39',
        title: '编程珠玑',
        author: '乔恩·本特利',
        category: '科技',
        tags: ['编程', '算法', '技术', '优化', '思维'],
        description: '通过实例教授编程技巧和思维方式，提升编程能力。',
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80'
    },
    {
        id: 'rec40',
        title: '智慧的疆界',
        author: '张首晟',
        category: '科技',
        tags: ['物理', '科学', '思维', '创新', '前沿'],
        description: '从物理学家的视角探讨科学思维和创新方法论。',
        cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80'
    },
    // ========== 金融（20本）==========
    {
        id: 'rec41',
        title: '穷爸爸富爸爸',
        author: '罗伯特·清崎',
        category: '金融',
        tags: ['理财', '财商', '投资', '思维', '财富'],
        description: '财商教育经典，揭示富人和穷人不同的金钱观和理财思维。',
        cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80'
    },
    {
        id: 'rec42',
        title: '原则',
        author: '瑞·达利欧',
        category: '金融',
        tags: ['投资', '管理', '决策', '生活', '原则'],
        description: '桥水基金创始人的生活和工作原则，关于如何做出更好的决策。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec43',
        title: '聪明的投资者',
        author: '本杰明·格雷厄姆',
        category: '金融',
        tags: ['投资', '股票', '价值', '理财', '经典'],
        description: '价值投资圣经，股神巴菲特的老师传授的投资智慧和原则。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec44',
        title: '漫步华尔街',
        author: '伯顿·马尔基尔',
        category: '金融',
        tags: ['投资', '股市', '理财', '策略', '长期'],
        description: '投资入门的经典教材，指导如何在股市中进行理性投资。',
        cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=80'
    },
    {
        id: 'rec45',
        title: '货币战争',
        author: '宋鸿兵',
        category: '金融',
        tags: ['货币', '金融', '历史', '经济', '国际'],
        description: '揭示国际金融资本的运作规律，探讨货币背后的权力博弈。',
        cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80'
    },
    {
        id: 'rec46',
        title: '小狗钱钱',
        author: '博多·舍费尔',
        category: '金融',
        tags: ['理财', '儿童', '故事', '财商', '入门'],
        description: '用生动的童话故事讲述理财知识，适合理财入门的读者。',
        cover: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=300&q=80'
    },
    {
        id: 'rec47',
        title: '巴菲特致股东的信',
        author: '沃伦·巴菲特',
        category: '金融',
        tags: ['投资', '价值', '股票', '智慧', '长期'],
        description: '投资大师每年写给股东的信，记录了他50多年的投资智慧。',
        cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=80'
    },
    {
        id: 'rec48',
        title: '股票大作手回忆录',
        author: '埃德温·勒菲弗',
        category: '金融',
        tags: ['股票', '交易', '投机', '市场', '经典'],
        description: '华尔街传奇交易员的回忆录，揭示股票市场的本质和人性。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec49',
        title: '财务自由之路',
        author: '博多·舍费尔',
        category: '金融',
        tags: ['理财', '财富', '自由', '规划', '人生'],
        description: '理财大师教你如何规划财务，实现财务自由的人生目标。',
        cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80'
    },
    {
        id: 'rec50',
        title: '对冲基金风云录',
        author: '巴顿·比格斯',
        category: '金融',
        tags: ['基金', '投资', '华尔街', '市场', '策略'],
        description: '华尔街顶级对冲基金经理的实战经验分享和市场洞察。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec51',
        title: '安全边际',
        author: '塞斯·卡拉曼',
        category: '金融',
        tags: ['投资', '价值', '风险', '安全', '经典'],
        description: '价值投资的安全边际概念，如何在投资中控制风险。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec52',
        title: '投资中最简单的事',
        author: '邱国鹭',
        category: '金融',
        tags: ['投资', '中国', '价值', '简单', '智慧'],
        description: '中国价值投资实践者的经验总结，投资的本质和原则。',
        cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=80'
    },
    {
        id: 'rec53',
        title: '经济学原理',
        author: '曼昆',
        category: '金融',
        tags: ['经济学', '原理', '入门', '经典', '教材'],
        description: '经济学入门最经典的教材，通俗易懂的经济学原理讲解。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec54',
        title: '薛兆丰经济学讲义',
        author: '薛兆丰',
        category: '金融',
        tags: ['经济学', '中国', '通俗', '思维', '生活'],
        description: '用生动的案例讲解经济学原理，经济学思维的生活应用。',
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80'
    },
    {
        id: 'rec55',
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        category: '金融',
        tags: ['思维', '心理学', '决策', '行为', '经济'],
        description: '诺贝尔经济学奖得主的心理学巨著，揭示人类决策的本质。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec56',
        title: '伟大的博弈',
        author: '约翰·戈登',
        category: '金融',
        tags: ['华尔街', '历史', '金融', '美国', '资本'],
        description: '华尔街金融帝国的崛起之路，美国金融史的经典之作。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec57',
        title: '富爸爸穷爸爸实践篇',
        author: '罗伯特·清崎',
        category: '金融',
        tags: ['理财', '实践', '财富', '行动', '改变'],
        description: '将富爸爸的理念付诸实践，具体的理财行动计划指南。',
        cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80'
    },
    {
        id: 'rec58',
        title: '随机漫步的傻瓜',
        author: '纳西姆·塔勒布',
        category: '金融',
        tags: ['概率', '随机', '风险', '黑天鹅', '思维'],
        description: '探讨随机性和概率在生活中的作用，如何面对不确定性。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec59',
        title: '小岛经济学',
        author: '彼得·希夫',
        category: '金融',
        tags: ['经济学', '寓言', '通俗', '有趣', '入门'],
        description: '用寓言故事讲解经济学原理，经济学入门最佳读物。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec60',
        title: '滚雪球',
        author: '艾丽斯·施罗德',
        category: '金融',
        tags: ['巴菲特', '传记', '投资', '财富', '人生'],
        description: '巴菲特授权的唯一官方传记，详细记录股神的传奇人生。',
        cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80'
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    generateRecommendations();
});

// 生成推荐
function generateRecommendations() {
    const notes = getNotes();
    const recommendationSection = document.getElementById('recommendation-section');
    
    if (!recommendationSection) return;
    
    if (notes.length === 0) {
        recommendationSection.style.display = 'none';
        return;
    }
    
    recommendationSection.style.display = 'block';
    
    const userPreferences = analyzeUserPreferences(notes);
    const recommendations = getBookRecommendations(userPreferences, notes);
    renderRecommendations(recommendations);
}

// 分析用户阅读偏好
function analyzeUserPreferences(notes) {
    const preferences = { authors: {}, tags: {}, categories: {} };
    
    notes.forEach(note => {
        if (note.author && note.author !== '未知作者') {
            preferences.authors[note.author] = (preferences.authors[note.author] || 0) + 1;
        }
        
        const content = stripHtml(note.content).toLowerCase();
        const keywords = ['人生', '成长', '爱情', '哲学', '历史', '科幻', '文学', '艺术', '金融', '投资', '科技', '技术', '理财', '财富'];
        
        keywords.forEach(keyword => {
            if (content.includes(keyword)) {
                preferences.tags[keyword] = (preferences.tags[keyword] || 0) + 1;
            }
        });
    });
    
    return preferences;
}

// 获取推荐书籍
function getBookRecommendations(preferences, userNotes) {
    const userBookTitles = userNotes.map(n => n.title.toLowerCase());
    
    const scoredBooks = BOOK_RECOMMENDATIONS.map(book => {
        let score = 0;
        
        if (preferences.authors[book.author]) {
            score += preferences.authors[book.author] * 3;
        }
        
        book.tags.forEach(tag => {
            if (preferences.tags[tag]) {
                score += preferences.tags[tag] * 2;
            }
        });
        
        score += Math.random() * 2;
        
        return { ...book, score };
    });
    
    return scoredBooks
        .filter(book => !userBookTitles.includes(book.title.toLowerCase()))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

// 渲染推荐
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendation-list');
    
    if (!container) return;
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p class="no-recommendations">暂无推荐，多写几篇笔记后就能获得个性化推荐啦！</p>';
        return;
    }
    
    container.innerHTML = recommendations.map(book => `
        <div class="recommendation-card">
            <div class="rec-cover" style="background-image: url('${book.cover}')">
                <span class="rec-category">${book.category}</span>
            </div>
            <div class="rec-content">
                <h4 class="rec-title">${escapeHtml(book.title)}</h4>
                <p class="rec-author">${escapeHtml(book.author)}</p>
                <p class="rec-description">${escapeHtml(book.description)}</p>
                <div class="rec-tags">
                    ${book.tags.slice(0, 3).map(tag => `<span class="rec-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 加载笔记列表
function loadNotes() {
    const notes = getNotes();
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    
    if (notes.length === 0) {
        notesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    notesList.innerHTML = notes.map(note => createNoteCard(note)).join('');
}

// 获取所有笔记
function getNotes() {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
}

// 创建笔记卡片 HTML
function createNoteCard(note) {
    const excerpt = stripHtml(note.content).substring(0, 100) + '...';
    const coverStyle = note.cover ? `background-image: url('${note.cover}')` : '';
    const date = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    
    return `
        <div class="note-card" onclick="showDetail('${note.id}')">
            <div class="note-cover" style="${coverStyle}"></div>
            <div class="note-content">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <p class="note-author">作者: ${escapeHtml(note.author)}</p>
                <p class="note-excerpt">${escapeHtml(excerpt)}</p>
                <p class="note-date">${date}</p>
            </div>
        </div>
    `;
}

// 显示编辑器
function showEditor() {
    currentNoteId = null;
    currentCoverImage = '';
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('editor').innerHTML = '';
    document.getElementById('cover-preview').style.backgroundImage = '';
    document.getElementById('cover-preview').classList.remove('has-image');
    document.getElementById('editor-modal').style.display = 'flex';
}

// 关闭编辑器
function closeEditor() {
    document.getElementById('editor-modal').style.display = 'none';
    currentCoverImage = '';
    currentNoteId = null;
}

// 保存笔记
function saveNote() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const content = document.getElementById('editor').innerHTML;
    
    if (!title) {
        alert('请输入书名');
        return;
    }
    
    if (!content.trim()) {
        alert('请输入笔记内容');
        return;
    }
    
    const note = {
        id: currentNoteId || Date.now().toString(),
        title: title,
        author: author || '未知作者',
        content: content,
        cover: currentCoverImage,
        createdAt: currentNoteId ? getNoteById(currentNoteId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const notes = getNotes();
    
    if (currentNoteId) {
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index !== -1) notes[index] = note;
    } else {
        notes.unshift(note);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    generateRecommendations();
    closeEditor();
    alert('笔记保存成功！');
}

// 显示笔记详情
function showDetail(id) {
    const note = getNoteById(id);
    if (!note) return;
    
    currentNoteId = id;
    
    document.getElementById('detail-title').textContent = note.title;
    document.getElementById('detail-author').textContent = note.author;
    document.getElementById('detail-date').textContent = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('detail-content').innerHTML = note.content;
    
    const coverContainer = document.getElementById('detail-cover');
    if (note.cover) {
        coverContainer.innerHTML = `<img src="${note.cover}" alt="${note.title}">`;
    } else {
        coverContainer.innerHTML = '';
    }
    
    document.getElementById('detail-modal').style.display = 'flex';
}

// 关闭详情页
function closeDetail() {
    document.getElementById('detail-modal').style.display = 'none';
    currentNoteId = null;
}

// 删除当前笔记
function deleteCurrentNote() {
    if (!currentNoteId) return;
    
    if (!confirm('确定要删除这条笔记吗？此操作不可撤销。')) return;
    
    const notes = getNotes().filter(n => n.id !== currentNoteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    generateRecommendations();
    closeDetail();
    alert('笔记已删除');
}

// 根据 ID 获取笔记
function getNoteById(id) {
    return getNotes().find(n => n.id === id);
}

// 格式化文本
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

// 处理封面上传
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCoverImage = e.target.result;
        const preview = document.getElementById('cover-preview');
        preview.style.backgroundImage = `url('${currentCoverImage}')`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

// 处理内容图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        
        const editor = document.getElementById('editor');
        editor.focus();
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
        } else {
            editor.appendChild(img);
        }
        
        const br = document.createElement('br');
        editor.appendChild(br);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 工具函数：去除 HTML 标签
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// 工具函数：转义 HTML 特殊字符
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'editor-modal') {
            closeEditor();
        } else if (event.target.id === 'detail-modal') {
            closeDetail();
        }
    }
};

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditor();
        closeDetail();
    }
});