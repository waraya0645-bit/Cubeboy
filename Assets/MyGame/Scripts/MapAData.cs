using System;
using System.Collections.Generic;

/// <summary>
/// Resources/MyGameData/map-a.json の形式。
/// マスの行は「0,0,100,0,...」のようなカンマ区切りの数値です。
/// </summary>
[Serializable]
public class MapAData
{
    public int width = 72;
    public int height = 30;
    public int pixelsPerTile = 64;
    public int playerStartX = 26;
    public int playerStartY = 3;

    public string[] floorRows;
    public string[] wallVisualRows;
    public string[] decorationVisualRows;
    public string[] wallCollisionRows;
    public string[] decorationCollisionRows;
    public TileImageEntry[] tileImageMap;

    [NonSerialized] private int[][] floorValues;
    [NonSerialized] private int[][] wallVisualValues;
    [NonSerialized] private int[][] decorationVisualValues;
    [NonSerialized] private int[][] wallCollisionValues;
    [NonSerialized] private int[][] decorationCollisionValues;

    public bool IsValid(out string error)
    {
        if (width <= 0 || height <= 0)
        {
            error = "width と height は1以上にしてください。";
            return false;
        }
        if (pixelsPerTile <= 0)
        {
            error = "pixelsPerTile は1以上にしてください。";
            return false;
        }
        if (playerStartX < 0 || playerStartX >= width || playerStartY < 0 || playerStartY >= height)
        {
            error = "playerStartX / playerStartY がマップ範囲外です。";
            return false;
        }

        if (!TryParseRows(floorRows, "floorRows", 1, out floorValues, out error)) return false;
        if (!TryParseRows(wallVisualRows, "wallVisualRows", -1, out wallVisualValues, out error)) return false;
        if (!TryParseRows(decorationVisualRows, "decorationVisualRows", -1, out decorationVisualValues, out error)) return false;
        if (!TryParseRows(wallCollisionRows, "wallCollisionRows", 1, out wallCollisionValues, out error)) return false;
        if (!TryParseRows(decorationCollisionRows, "decorationCollisionRows", 1, out decorationCollisionValues, out error)) return false;

        if (tileImageMap == null) tileImageMap = new TileImageEntry[0];
        HashSet<int> usedIds = new HashSet<int>();
        for (int i = 0; i < tileImageMap.Length; i++)
        {
            TileImageEntry entry = tileImageMap[i];
            if (entry == null || entry.id <= 0 || string.IsNullOrWhiteSpace(entry.image))
            {
                error = "tileImageMap の各要素には、1以上のidとimage名が必要です。";
                return false;
            }
            if (!usedIds.Add(entry.id))
            {
                error = "tileImageMap で画像IDが重複しています: " + entry.id;
                return false;
            }
        }

        // 見た目レイヤーの番号に対応する画像があるか確認します。
        if (!VisualIdsHaveImages(wallVisualValues, "wallVisualRows", out error)) return false;
        if (!VisualIdsHaveImages(decorationVisualValues, "decorationVisualRows", out error)) return false;

        error = null;
        return true;
    }

    private bool TryParseRows(string[] rows, string fieldName, int maxValue,
        out int[][] parsed, out string error)
    {
        parsed = null;
        if (rows == null || rows.Length != height)
        {
            error = fieldName + " は height と同じ " + height + " 行にしてください。";
            return false;
        }

        int[][] result = new int[height][];
        for (int y = 0; y < height; y++)
        {
            if (string.IsNullOrWhiteSpace(rows[y]))
            {
                error = fieldName + " の " + y + " 行目が空です。";
                return false;
            }

            string[] parts = rows[y].Split(',');
            if (parts.Length != width)
            {
                error = fieldName + " の " + y + " 行目は " + width + " 個の数値が必要ですが、" + parts.Length + " 個です。";
                return false;
            }

            result[y] = new int[width];
            for (int x = 0; x < width; x++)
            {
                int value;
                if (!int.TryParse(parts[x].Trim(), out value) || value < 0 || (maxValue >= 0 && value > maxValue))
                {
                    string allowed = maxValue >= 0 ? "0 または " + maxValue : "0以上の整数";
                    error = fieldName + " のY=" + y + ", X=" + x + " は " + allowed + " にしてください。";
                    return false;
                }
                result[y][x] = value;
            }
        }

        parsed = result;
        error = null;
        return true;
    }

    private bool VisualIdsHaveImages(int[][] values, string fieldName, out string error)
    {
        HashSet<int> ids = new HashSet<int>();
        for (int i = 0; i < tileImageMap.Length; i++)
        {
            if (tileImageMap[i] != null) ids.Add(tileImageMap[i].id);
        }

        for (int y = 0; y < values.Length; y++)
        {
            for (int x = 0; x < values[y].Length; x++)
            {
                int id = values[y][x];
                if (id != 0 && !ids.Contains(id))
                {
                    error = fieldName + " のY=" + y + ", X=" + x + " で使う画像ID " + id + " が tileImageMap にありません。";
                    return false;
                }
            }
        }
        error = null;
        return true;
    }

    public int GetFloor(int x, int y) { return GetValue(floorValues, x, y); }
    public int GetWallVisual(int x, int y) { return GetValue(wallVisualValues, x, y); }
    public int GetDecorationVisual(int x, int y) { return GetValue(decorationVisualValues, x, y); }
    public int GetWallCollision(int x, int y) { return GetValue(wallCollisionValues, x, y); }
    public int GetDecorationCollision(int x, int y) { return GetValue(decorationCollisionValues, x, y); }

    private int GetValue(int[][] values, int x, int y)
    {
        if (values == null || y < 0 || y >= values.Length || x < 0 || x >= width) return 0;
        return values[y][x];
    }

    public string GetImageName(int id)
    {
        if (id == 0 || tileImageMap == null) return null;
        for (int i = 0; i < tileImageMap.Length; i++)
        {
            if (tileImageMap[i] != null && tileImageMap[i].id == id)
                return tileImageMap[i].image;
        }
        return null;
    }
}

[Serializable]
public class TileImageEntry
{
    public int id;
    public string image;
}
