using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// map-a 専用ゲーム制御。
/// データは Resources/MyGameData/map-a.json と objects.json で編集する。
/// WASD: 移動 / E: 正面の対象を調べる。
/// </summary>
public class MyGameController : MonoBehaviour
{
    private const float TileSize = 1f;
    private const float PlayerHalfSize = 28f / 64f;
    private const float CameraHalfHeight = 648f / 64f / 2f;
    private const int RoomWidth = 18;
    private const int RoomHeight = 10;

    [SerializeField] private float moveSpeed = 4.6875f;

    private Camera gameCamera;
    private Rigidbody2D playerBody;
    private SpriteRenderer playerRenderer;
    private GameObject mapRoot;
    private GameObject objectRoot;
    private readonly List<WorldItem> items = new List<WorldItem>();
    private readonly Dictionary<string, int> inventory = new Dictionary<string, int>();

    private MapAData mapData;
    private ObjectDataFile objectData;

    private Sprite blackSprite;
    private Sprite floorSprite;
    private Sprite frontSprite;
    private Sprite backSprite;
    private Sprite leftSprite;
    private Sprite rightSprite;

    private bool gameStarted;
    private Vector2 facing = Vector2.down;
    private string message = "STARTを押してください";
    private int cameraRoomX = int.MinValue;
    private int cameraRoomY = int.MinValue;

    private sealed class WorldItem
    {
        public string id;
        public string imageId;
        public string interactionType;
        public string revealsObjectId;
        public string itemId;
        public Vector2 center;
        public float hitboxWidth;
        public float hitboxHeight;
        public bool interactable;
        public bool isInteracting;
        public GameObject gameObject;
        public SpriteRenderer renderer;
        public BoxCollider2D collider;
    }

    private void Start()
    {
        if (!LoadGameData())
        {
            enabled = false;
            return;
        }

        LoadSprites();
        SetupCamera();
        BuildMapA();
        CreatePlayer();
        CreateObjects();
    }

    private bool LoadGameData()
    {
        TextAsset mapFile = Resources.Load<TextAsset>("MyGameData/map-a");
        if (mapFile == null)
        {
            Debug.LogError("map-a.json が見つかりません: Assets/MyGame/Resources/MyGameData/map-a.json");
            return false;
        }

        mapData = JsonUtility.FromJson<MapAData>(mapFile.text);
        if (mapData == null)
        {
            Debug.LogError("map-a.json を読み取れません。JSONの形式を確認してください。");
            return false;
        }
        if (!mapData.IsValid(out string mapError))
        {
            Debug.LogError("map-a.json の内容を確認してください: " + mapError);
            return false;
        }

        TextAsset objectFile = Resources.Load<TextAsset>("MyGameData/objects");
        if (objectFile == null)
        {
            Debug.LogError("objects.json が見つかりません: Assets/MyGame/Resources/MyGameData/objects.json");
            return false;
        }

        objectData = JsonUtility.FromJson<ObjectDataFile>(objectFile.text);
        if (objectData == null)
        {
            Debug.LogError("objects.json を読み取れません。");
            return false;
        }
        if (objectData.objects == null) objectData.objects = new ObjectEntry[0];
        return true;
    }

    private void LoadSprites()
    {
        blackSprite = LoadSprite("black");
        floorSprite = LoadSprite("floor");
        frontSprite = LoadSprite("front_cube");
        backSprite = LoadSprite("back_cube");
        leftSprite = LoadSprite("left_cube");
        rightSprite = LoadSprite("right_cube");
    }

    private Sprite LoadSprite(string assetName)
    {
        if (string.IsNullOrEmpty(assetName)) return null;
        Sprite sprite = Resources.Load<Sprite>("MyGameSprites/" + assetName);
        if (sprite == null)
        {
            Debug.LogError("画像を読み込めません: Assets/MyGame/Resources/MyGameSprites/" + assetName + ".png\nInspectorで Texture Type を Sprite (2D and UI) にしてください。");
        }
        return sprite;
    }

    private void SetupCamera()
    {
        gameCamera = Camera.main;
        if (gameCamera == null)
        {
            GameObject cameraObject = new GameObject("Main Camera");
            cameraObject.tag = "MainCamera";
            gameCamera = cameraObject.AddComponent<Camera>();
        }

        gameCamera.orthographic = true;
        gameCamera.orthographicSize = CameraHalfHeight;
        gameCamera.backgroundColor = Color.black;
        gameCamera.transform.position = new Vector3(RoomWidth / 2f, -CameraHalfHeight, -10f);
    }

    private void BuildMapA()
    {
        mapRoot = new GameObject("Map A");

        for (int row = 0; row < mapData.height; row++)
        {
            for (int col = 0; col < mapData.width; col++)
            {
                Sprite tileSprite = mapData.GetFloor(col, row) == 0 ? blackSprite : floorSprite;
                Vector3 center = TileCenter(col, row);
                if (tileSprite != null)
                {
                    GameObject tile = new GameObject("Floor_" + col + "_" + row);
                    tile.transform.SetParent(mapRoot.transform);
                    tile.transform.position = center;
                    SpriteRenderer renderer = tile.AddComponent<SpriteRenderer>();
                    renderer.sprite = tileSprite;
                    renderer.sortingOrder = -10000;
                }

                // 壁の見た目レイヤー。0は何も置かず、100などの番号は tileImageMap で画像に変換します。
                CreateMapVisual("WallVisual", mapData.GetWallVisual(col, row), col, row, 40);

                // 装飾物の見た目レイヤー。
                CreateMapVisual("DecorationVisual", mapData.GetDecorationVisual(col, row), col, row, 40);

                // 壁の当たり判定レイヤー。見た目の有無とは独立しています。
                if (mapData.GetWallCollision(col, row) == 1)
                {
                    CreateCollisionTile("WallCollision", col, row);
                }

                // 装飾物の当たり判定レイヤー。壁とは別に編集できます。
                if (mapData.GetDecorationCollision(col, row) == 1)
                {
                    CreateCollisionTile("DecorationCollision", col, row);
                }
            }
        }
    }

    private void CreateMapVisual(string objectPrefix, int imageId, int col, int row, int sortingOffset)
    {
        // 見た目レイヤーでは0を「画像なし」として扱います。
        if (imageId == 0) return;

        string assetName = mapData.GetImageName(imageId);
        if (string.IsNullOrEmpty(assetName)) return;
        Sprite sprite = LoadSprite(assetName);
        if (sprite == null) return;

        GameObject tile = new GameObject(objectPrefix + "_" + col + "_" + row + "_" + imageId);
        tile.transform.SetParent(mapRoot.transform);
        tile.transform.position = TileCenter(col, row);
        SpriteRenderer renderer = tile.AddComponent<SpriteRenderer>();
        renderer.sprite = sprite;
        // Unityでは上の行ほどYが大きい（負の値が小さい）ため、行に応じて描画順を変えます。
        renderer.sortingOrder = row * 100 + sortingOffset;
    }

    private void CreateCollisionTile(string objectPrefix, int col, int row)
    {
        GameObject tile = new GameObject(objectPrefix + "_" + col + "_" + row);
        tile.transform.SetParent(mapRoot.transform);
        tile.transform.position = TileCenter(col, row);
        BoxCollider2D collider = tile.AddComponent<BoxCollider2D>();
        collider.size = new Vector2(TileSize, TileSize);
    }

    private Vector3 TileCenter(int col, int row)
    {
        return new Vector3(col + 0.5f, -(row + 0.5f), 0f);
    }

    private void CreatePlayer()
    {
        GameObject player = new GameObject("Player");
        player.transform.position = TileCenter(mapData.playerStartX, mapData.playerStartY);
        playerRenderer = player.AddComponent<SpriteRenderer>();
        playerRenderer.sprite = frontSprite;
        playerRenderer.sortingOrder = 400;

        playerBody = player.AddComponent<Rigidbody2D>();
        playerBody.gravityScale = 0f;
        playerBody.freezeRotation = true;
        playerBody.interpolation = RigidbodyInterpolation2D.Interpolate;
        playerBody.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
        playerBody.constraints = RigidbodyConstraints2D.FreezeRotation;

        BoxCollider2D playerCollider = player.AddComponent<BoxCollider2D>();
        float halfSize = PlayerHalfSize;
        playerCollider.size = new Vector2(halfSize * 2f, halfSize * 2f);
    }

    private void CreateObjects()
    {
        objectRoot = new GameObject("Map A Objects");

        foreach (ObjectEntry entry in objectData.objects)
        {
            if (entry == null || string.IsNullOrEmpty(entry.id))
            {
                Debug.LogWarning("objects.json に id がないオブジェクトがあります。スキップします。");
                continue;
            }
            if (entry.tileX < 0 || entry.tileX >= mapData.width || entry.tileY < 0 || entry.tileY >= mapData.height)
            {
                Debug.LogWarning("objects.json の " + entry.id + " はマップ外にあるためスキップします。");
                continue;
            }
            if (FindItemById(entry.id) != null)
            {
                Debug.LogWarning("objects.json で id が重複しています: " + entry.id);
                continue;
            }

            Sprite sprite = LoadSprite(entry.image);
            if (sprite == null) continue;

            float width = Mathf.Max(1f, entry.hitboxWidth) / mapData.pixelsPerTile;
            float height = Mathf.Max(1f, entry.hitboxHeight) / mapData.pixelsPerTile;
            WorldItem item = CreateItem(entry, sprite, width, height);
            items.Add(item);

            if (item.interactionType == "pickup")
            {
                string inventoryId = string.IsNullOrEmpty(item.itemId) ? item.id : item.itemId;
                if (!inventory.ContainsKey(inventoryId)) inventory[inventoryId] = 0;
            }
        }
    }

    private WorldItem CreateItem(ObjectEntry entry, Sprite sprite, float hitboxWidth, float hitboxHeight)
    {
        GameObject go = new GameObject("Object_" + entry.id);
        go.transform.SetParent(objectRoot.transform);
        go.transform.position = TileCenter(entry.tileX, entry.tileY);

        SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = sprite;
        sr.sortingOrder = Mathf.RoundToInt(-(go.transform.position.y - hitboxHeight / 2f) * 100f);

        BoxCollider2D col = go.AddComponent<BoxCollider2D>();
        col.size = new Vector2(hitboxWidth, hitboxHeight);

        WorldItem item = new WorldItem();
        item.id = entry.id;
        item.imageId = entry.image;
        item.interactionType = entry.interactionType ?? "none";
        item.revealsObjectId = entry.revealsObjectId;
        item.itemId = entry.itemId;
        item.center = go.transform.position;
        item.hitboxWidth = hitboxWidth;
        item.hitboxHeight = hitboxHeight;
        item.interactable = entry.interactable;
        item.gameObject = go;
        item.renderer = sr;
        item.collider = col;

        go.SetActive(entry.initiallyActive);
        if (!entry.initiallyActive) col.enabled = false;
        return item;
    }

    private void Update()
    {
        if (!gameStarted || playerBody == null) return;

        Vector2 input = ReadMovementInput();
        if (input.sqrMagnitude > 0.001f) UpdateFacing(input.normalized);

        if (Input.GetKeyDown(KeyCode.E)) Interact();

        UpdateCameraRoom();
        UpdateSorting();
    }

    private void FixedUpdate()
    {
        if (playerBody == null) return;
        if (!gameStarted)
        {
            playerBody.velocity = Vector2.zero;
            return;
        }

        Vector2 input = ReadMovementInput();
        if (input.sqrMagnitude > 1f) input.Normalize();
        playerBody.velocity = input * moveSpeed;
    }

    private Vector2 ReadMovementInput()
    {
        float x = 0f;
        float y = 0f;
        if (Input.GetKey(KeyCode.A)) x -= 1f;
        if (Input.GetKey(KeyCode.D)) x += 1f;
        if (Input.GetKey(KeyCode.S)) y -= 1f;
        if (Input.GetKey(KeyCode.W)) y += 1f;
        return new Vector2(x, y);
    }

    private void UpdateFacing(Vector2 direction)
    {
        float degrees = (Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg + 360f) % 360f;
        if (degrees >= 60f && degrees < 120f)
        {
            facing = Vector2.up;
            playerRenderer.sprite = backSprite;
        }
        else if (degrees >= 120f && degrees < 240f)
        {
            facing = Vector2.left;
            playerRenderer.sprite = leftSprite;
        }
        else if (degrees >= 240f && degrees < 300f)
        {
            facing = Vector2.down;
            playerRenderer.sprite = frontSprite;
        }
        else
        {
            facing = Vector2.right;
            playerRenderer.sprite = rightSprite;
        }
    }

    private void Interact()
    {
        WorldItem target = FindTargetInFront();
        if (target == null)
        {
            message = "前方に調べられる対象がありません";
            return;
        }

        if (target.interactionType == "reveal")
        {
            if (target.isInteracting) return;
            target.isInteracting = true;
            target.interactable = false;
            message = target.id + " にインタラクトしました";
            StartCoroutine(RevealLinkedObject(target));
        }
        else if (target.interactionType == "pickup")
        {
            target.interactable = false;
            target.collider.enabled = false;
            target.gameObject.SetActive(false);
            string inventoryId = string.IsNullOrEmpty(target.itemId) ? target.id : target.itemId;
            inventory[inventoryId] = inventory.ContainsKey(inventoryId) ? inventory[inventoryId] + 1 : 1;
            message = "アイテムを入手しました: " + target.id;
        }
        else
        {
            message = target.id + " を調べました";
        }
    }

    private WorldItem FindTargetInFront()
    {
        Vector2 playerPosition = playerBody.position;
        float pLeft = playerPosition.x - PlayerHalfSize;
        float pRight = playerPosition.x + PlayerHalfSize;
        float pBottom = playerPosition.y - PlayerHalfSize;
        float pTop = playerPosition.y + PlayerHalfSize;

        WorldItem nearest = null;
        float nearestGap = float.MaxValue;

        foreach (WorldItem item in items)
        {
            if (item == null || !item.interactable || !item.gameObject.activeInHierarchy) continue;

            float oLeft = item.center.x - item.hitboxWidth / 2f;
            float oRight = item.center.x + item.hitboxWidth / 2f;
            float oBottom = item.center.y - item.hitboxHeight / 2f;
            float oTop = item.center.y + item.hitboxHeight / 2f;
            bool aligned = false;
            float gap = float.MaxValue;

            if (facing == Vector2.up)
            {
                aligned = item.center.y > playerPosition.y && pRight > oLeft && pLeft < oRight;
                gap = oBottom - pTop;
            }
            else if (facing == Vector2.down)
            {
                aligned = item.center.y < playerPosition.y && pRight > oLeft && pLeft < oRight;
                gap = pBottom - oTop;
            }
            else if (facing == Vector2.left)
            {
                aligned = item.center.x < playerPosition.x && pTop > oBottom && pBottom < oTop;
                gap = pLeft - oRight;
            }
            else if (facing == Vector2.right)
            {
                aligned = item.center.x > playerPosition.x && pTop > oBottom && pBottom < oTop;
                gap = oLeft - pRight;
            }

            if (aligned && gap >= -4f / mapData.pixelsPerTile && gap <= 16f / mapData.pixelsPerTile && Mathf.Abs(gap) < nearestGap)
            {
                nearest = item;
                nearestGap = Mathf.Abs(gap);
            }
        }
        return nearest;
    }

    private IEnumerator RevealLinkedObject(WorldItem source)
    {
        const float duration = 0.6f;
        float elapsed = 0f;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            Color color = source.renderer.color;
            color.a = 1f - Mathf.Clamp01(elapsed / duration);
            source.renderer.color = color;
            yield return null;
        }

        source.collider.enabled = false;
        source.gameObject.SetActive(false);

        WorldItem linked = FindItemById(source.revealsObjectId);
        if (linked != null)
        {
            linked.gameObject.SetActive(true);
            linked.collider.enabled = true;
            linked.renderer.color = Color.white;
            linked.interactable = true;
        }
        else if (!string.IsNullOrEmpty(source.revealsObjectId))
        {
            Debug.LogWarning("reveal先のオブジェクトがありません: " + source.revealsObjectId);
        }
    }

    private WorldItem FindItemById(string id)
    {
        if (string.IsNullOrEmpty(id)) return null;
        foreach (WorldItem item in items)
        {
            if (item != null && item.id == id) return item;
        }
        return null;
    }

    private void UpdateCameraRoom()
    {
        if (playerBody == null || gameCamera == null) return;
        int roomX = Mathf.FloorToInt(playerBody.position.x / RoomWidth);
        int roomY = Mathf.FloorToInt((-playerBody.position.y) / RoomHeight);
        if (roomX == cameraRoomX && roomY == cameraRoomY) return;

        cameraRoomX = roomX;
        cameraRoomY = roomY;
        gameCamera.transform.position = new Vector3(
            roomX * RoomWidth + RoomWidth / 2f,
            -(roomY * RoomHeight + CameraHalfHeight),
            -10f);
    }

    private void UpdateSorting()
    {
        if (playerRenderer != null && playerBody != null)
            playerRenderer.sortingOrder = Mathf.RoundToInt(-(playerBody.position.y - PlayerHalfSize) * 100f);

        foreach (WorldItem item in items)
        {
            if (item != null && item.renderer != null && item.gameObject.activeInHierarchy)
                item.renderer.sortingOrder = Mathf.RoundToInt(-(item.center.y - item.hitboxHeight / 2f) * 100f);
        }
    }

    private void OnGUI()
    {
        GUI.Label(new Rect(12, 10, 700, 28), "WASD: 移動    E: 正面を調べる");
        GUI.Label(new Rect(12, 36, 700, 28), message);
        foreach (KeyValuePair<string, int> entry in inventory)
            GUI.Label(new Rect(12, 62, 300, 28), "アイテム " + entry.Key + ": " + entry.Value);

        if (!gameStarted)
        {
            const float buttonWidth = 160f;
            const float buttonHeight = 64f;
            Rect rect = new Rect(
                (Screen.width - buttonWidth) / 2f,
                (Screen.height - buttonHeight) / 2f,
                buttonWidth,
                buttonHeight);
            if (GUI.Button(rect, "START"))
            {
                gameStarted = true;
                message = "WASDで移動し、対象の正面でEを押してください";
                cameraRoomX = int.MinValue;
                cameraRoomY = int.MinValue;
                UpdateCameraRoom();
            }
        }
    }
}
